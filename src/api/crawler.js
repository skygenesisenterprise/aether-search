/**
 * Main crawling logic and functions
 */

const config = require('./config');
const {
  fetchUrl,
  delay,
  normalizeUrl,
  isAllowedByRobots,
  extractDomain
} = require('./utils');
const {
  extractPageData,
  extractLinks,
  shouldCrawlContentType
} = require('./scraper');
const {
  saveUrl,
  updateUrlStatus,
  getNextUrl,
  savePage,
  logCrawlError,
  getCrawlerStats,
  closeConnection
} = require('./services/dbService');
const {
  logInfo,
  logError,
  logWarning,
  logCrawlStats,
  logDebug
} = require('./services/loggingService');

// Import Puppeteer support
const {
  fetchWithPuppeteer,
  processPuppeteerUrl,
  requiresJavaScript,
  closeBrowser
} = require('./puppeteerScraper');

// Import priority-based crawling
const {
  PriorityUrlManager,
  calculateUrlPriority
} = require('./priorityCrawler');

// Crawl state
const crawlState = {
  crawledUrls: new Set(),
  inProgress: 0,
  totalProcessed: 0,
  startTime: null,
  activeWorkers: 0,
  maxWorkers: config.crawler.concurrency,
  domainQueues: new Map(),
  domainLastAccess: new Map(),
  isRunning: false,
  priorityManager: null
};

/**
 * Rate limiter for a domain
 * @param {string} domain - Domain to rate limit
 * @returns {Promise<void>}
 */
async function rateLimitDomain(domain) {
  const now = Date.now();
  const lastAccess = crawlState.domainLastAccess.get(domain) || 0;
  const elapsed = now - lastAccess;

  if (elapsed < config.crawler.requestDelay) {
    const waitTime = config.crawler.requestDelay - elapsed;
    await delay(waitTime);
  }

  // Update last access time
  crawlState.domainLastAccess.set(domain, Date.now());
}

/**
 * Determine if a URL should be crawled with Puppeteer
 * @param {string} url - URL to check
 * @param {string} contentType - Content type (optional)
 * @param {string} html - HTML content (optional)
 * @returns {boolean} - Whether to use Puppeteer
 */
function shouldUsePuppeteer(url, contentType, html) {
  if (!config.crawler.puppeteer.enabled) {
    return false;
  }

  // Check URL patterns that should always use Puppeteer
  if (config.crawler.puppeteer.urlPatterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(url);
  })) {
    return true;
  }

  // Auto-detect if content requires JavaScript
  if (config.crawler.puppeteer.autoDetect && html && requiresJavaScript(html)) {
    logInfo('Auto-detected JavaScript-heavy page', { url });
    return true;
  }

  return false;
}

/**
 * Process a single URL
 * @param {string} url - URL to process
 * @param {number} depth - Current depth
 * @param {number} priority - URL priority (if using priority-based crawling)
 * @returns {Promise<void>}
 */
async function processUrl(url, depth, priority = 100) {
  if (crawlState.crawledUrls.has(url)) {
    return;
  }

  // Mark URL as crawled to avoid duplicates
  crawlState.crawledUrls.add(url);
  crawlState.inProgress++;

  try {
    // Check if URL is allowed by robots.txt
    const robotsAllowed = await isAllowedByRobots(url);
    if (!robotsAllowed) {
      logInfo('URL disallowed by robots.txt', { url });
      await updateUrlStatus(url, 'completed');
      return;
    }

    // Apply rate limiting for the domain
    const domain = extractDomain(url);
    await rateLimitDomain(domain);

    // Fetch the URL
    logInfo('Crawling URL', { url, depth, priority });

    // Determine whether to use Puppeteer or regular fetching
    let response, pageData, links;

    if (shouldUsePuppeteer(url)) {
      // Use Puppeteer for JavaScript-rendered pages
      logInfo('Using Puppeteer for URL', { url });
      const puppeteerResult = await processPuppeteerUrl(url);
      pageData = puppeteerResult.pageData;
      links = puppeteerResult.links;
      url = puppeteerResult.finalUrl; // Update URL in case of redirects
    } else {
      // Use regular fetch
      response = await fetchUrl(url);

      // Check if content type is HTML
      if (!shouldCrawlContentType(response.contentType)) {
        logInfo('Skipping non-HTML content', { url, contentType: response.contentType });
        await updateUrlStatus(url, 'completed');
        return;
      }

      // Check if the page requires JavaScript and we should retry with Puppeteer
      if (config.crawler.puppeteer.enabled && config.crawler.puppeteer.autoDetect &&
          requiresJavaScript(response.data)) {
        logInfo('Switching to Puppeteer for JavaScript-heavy page', { url });
        const puppeteerResult = await processPuppeteerUrl(url);
        pageData = puppeteerResult.pageData;
        links = puppeteerResult.links;
        url = puppeteerResult.finalUrl; // Update URL in case of redirects
      } else {
        // Extract data from the page
        pageData = extractPageData(response.data, url);

        // Extract links
        links = extractLinks(response.data, url);
      }
    }

    // Save page data
    await savePage(pageData);

    // Process links if we haven't reached max depth
    if (depth < config.crawler.maxDepth) {
      // Save links for further crawling
      if (config.crawler.priority.enabled && crawlState.priorityManager) {
        // Add URLs with priority
        for (const link of links) {
          if (!crawlState.crawledUrls.has(link)) {
            crawlState.priorityManager.addUrl(link, {
              depth: depth + 1,
              parentUrl: url,
              parentImportance: 10 - (priority / 20) // Convert priority score to importance
            });
          }
        }
      } else {
        // Standard crawling without priority
        for (const link of links) {
          if (!crawlState.crawledUrls.has(link)) {
            await saveUrl(link, depth + 1, url);
          }
        }
      }

      logInfo('Extracted links', { url, count: links.length });
    }

    // Mark URL as completed
    await updateUrlStatus(url, 'completed');
    crawlState.totalProcessed++;

    // Log progress
    if (crawlState.totalProcessed % 10 === 0) {
      const stats = await getCrawlerStats();
      if (config.crawler.priority.enabled && crawlState.priorityManager) {
        const priorityStats = crawlState.priorityManager.getStats();
        logCrawlStats({ ...stats, priorityQueue: priorityStats });
      } else {
        logCrawlStats(stats);
      }
    }
  } catch (error) {
    logError('Error processing URL', { url, error: error.message });
    await logCrawlError(url, error);
    await updateUrlStatus(url, 'error');
  } finally {
    crawlState.inProgress--;
  }
}

/**
 * Crawler worker function
 * @param {number} workerId - ID of the worker
 * @returns {Promise<void>}
 */
async function crawlerWorker(workerId) {
  crawlState.activeWorkers++;

  try {
    while (crawlState.isRunning &&
           crawlState.totalProcessed < config.crawler.maxPages) {

      let urlDoc;

      if (config.crawler.priority.enabled && crawlState.priorityManager) {
        // Use priority-based URL selection
        urlDoc = crawlState.priorityManager.getNextUrl();

        if (!urlDoc) {
          // No more URLs in priority queue
          await delay(1000);

          // If no URLs in progress and none found, we're done
          if (crawlState.inProgress === 0) {
            logInfo('No more URLs to crawl', { workerId });
            break;
          }

          continue;
        }

        // Process the URL with priority
        await processUrl(urlDoc.url, urlDoc.depth, urlDoc.priority);
      } else {
        // Standard URL selection from database
        urlDoc = await getNextUrl(config.crawler.maxDepth);

        if (!urlDoc) {
          // No more URLs to crawl, wait and check again
          await delay(1000);

          // If no URLs in progress and none found, we're done
          if (crawlState.inProgress === 0) {
            logInfo('No more URLs to crawl', { workerId });
            break;
          }

          continue;
        }

        // Process the URL
        await processUrl(urlDoc.url, urlDoc.depth);
      }
    }
  } catch (error) {
    logError('Worker error', { workerId, error: error.message });
  } finally {
    crawlState.activeWorkers--;
  }
}

/**
 * Initialize priority crawling
 * @param {Array<string>} seedUrls - Seed URLs
 */
function initializePriorityCrawling(seedUrls) {
  if (!config.crawler.priority.enabled) {
    return null;
  }

  // Create priority manager
  const priorityManager = new PriorityUrlManager();

  // Set up important domains
  const importantDomains = config.crawler.priority.importantDomains;

  // Initialize with seed URLs
  priorityManager.initialize(seedUrls, importantDomains);

  // Apply URL pattern importance settings
  config.crawler.priority.importantPatterns.forEach(({ pattern, importance }) => {
    seedUrls.forEach(url => {
      if (url.includes(pattern)) {
        priorityManager.setUrlImportance(url, importance);
      }
    });
  });

  return priorityManager;
}

/**
 * Start crawling with seed URLs
 * @param {Array<string>} seedUrls - URLs to start crawling from
 * @returns {Promise<void>}
 */
async function startCrawling(seedUrls) {
  try {
    // Reset crawl state
    crawlState.crawledUrls = new Set();
    crawlState.inProgress = 0;
    crawlState.totalProcessed = 0;
    crawlState.startTime = Date.now();
    crawlState.isRunning = true;

    logInfo('Starting crawler', { seedUrls, config: config.crawler });

    // Initialize priority-based crawling if enabled
    if (config.crawler.priority.enabled) {
      crawlState.priorityManager = initializePriorityCrawling(seedUrls);
      logInfo('Priority-based crawling enabled', {
        seedUrls: seedUrls.length,
        queueSize: crawlState.priorityManager.getStats().queueSize
      });
    } else {
      // Standard crawling - save seed URLs to database
      for (const url of seedUrls) {
        const normalizedUrl = normalizeUrl(url);
        if (normalizedUrl) {
          await saveUrl(normalizedUrl, 0);
        } else {
          logWarning('Invalid seed URL', { url });
        }
      }
    }

    // Start worker threads
    const workers = [];
    for (let i = 0; i < config.crawler.concurrency; i++) {
      workers.push(crawlerWorker(i));
    }

    // Wait for all workers to finish
    await Promise.all(workers);

    // Get final stats
    const endTime = Date.now();
    const elapsedSeconds = (endTime - crawlState.startTime) / 1000;
    const stats = await getCrawlerStats();

    logInfo('Crawling finished', {
      totalProcessed: crawlState.totalProcessed,
      elapsedSeconds,
      pagesPerSecond: (crawlState.totalProcessed / elapsedSeconds).toFixed(2),
      stats
    });

    // Close Puppeteer browser if used
    if (config.crawler.puppeteer.enabled) {
      await closeBrowser();
    }

    // Close database connection
    await closeConnection();
  } catch (error) {
    logError('Error in crawler', { error: error.message });
    throw error;
  } finally {
    crawlState.isRunning = false;
  }
}

/**
 * Stop the crawler
 * @returns {Promise<void>}
 */
async function stopCrawling() {
  logInfo('Stopping crawler');
  crawlState.isRunning = false;

  // Wait for active workers to finish current tasks
  while (crawlState.activeWorkers > 0) {
    await delay(500);
  }

  // Get final stats
  const stats = await getCrawlerStats();
  logCrawlStats(stats);

  // Close Puppeteer browser if used
  if (config.crawler.puppeteer.enabled) {
    await closeBrowser();
  }

  // Close database connection
  await closeConnection();
}

module.exports = {
  startCrawling,
  stopCrawling
};
