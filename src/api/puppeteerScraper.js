/**
 * Puppeteer scraper for JavaScript-rendered websites
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const config = require('./config');
const { logInfo, logError } = require('./services/loggingService');
const { extractLinks, extractPageData } = require('./scraper');

// Browser instance cache
let browserInstance = null;

/**
 * Get or create a browser instance
 * @returns {Promise<Browser>} - Puppeteer browser instance
 */
async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    // Handle browser close on process exit
    process.on('exit', async () => {
      await closeBrowser();
    });
  }

  return browserInstance;
}

/**
 * Close the browser instance
 * @returns {Promise<void>}
 */
async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * Fetch a URL using Puppeteer
 * @param {string} url - URL to fetch
 * @param {Object} options - Options for puppeteer
 * @returns {Promise<Object>} - Page content and data
 */
async function fetchWithPuppeteer(url, options = {}) {
  const {
    waitForSelector = 'body',
    timeout = config.crawler.timeout,
    scrollToBottom = true,
    waitTime = 1000
  } = options;

  let browser;
  let page;

  try {
    browser = await getBrowser();
    page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(config.crawler.userAgent);

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Set request timeout
    await page.setDefaultNavigationTimeout(timeout);

    // Log request
    logInfo('Fetching with Puppeteer', { url });

    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout
    });

    // Wait for content to load
    await page.waitForSelector(waitForSelector, { timeout });

    // Scroll to bottom if required to load lazy content
    if (scrollToBottom) {
      await autoScroll(page);
    }

    // Wait additional time for any dynamic content
    await page.waitForTimeout(waitTime);

    // Get page content
    const content = await page.content();

    // Get HTTP status
    const response = page.mainFrame().url() === url ? 200 : 301;

    // Get final URL (in case of redirects)
    const finalUrl = page.url();

    // Extract metadata
    const metadata = await extractMetadata(page);

    return {
      url: finalUrl,
      status: response,
      data: content,
      contentType: 'text/html',
      metadata
    };
  } catch (error) {
    logError('Puppeteer fetch error', { url, error: error.message });
    throw new Error(`Failed to fetch ${url} with Puppeteer: ${error.message}`);
  } finally {
    if (page) {
      await page.close();
    }
  }
}

/**
 * Auto-scroll a page to load lazy content
 * @param {Page} page - Puppeteer page
 * @returns {Promise<void>}
 */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 10000) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

/**
 * Extract metadata from a page
 * @param {Page} page - Puppeteer page
 * @returns {Promise<Object>} - Page metadata
 */
async function extractMetadata(page) {
  return await page.evaluate(() => {
    const metadata = {};

    // Get meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(tag => {
      const name = tag.getAttribute('name') || tag.getAttribute('property');
      const content = tag.getAttribute('content');
      if (name && content) {
        metadata[name] = content;
      }
    });

    // Get canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      metadata.canonical = canonical.getAttribute('href');
    }

    return metadata;
  });
}

/**
 * Process a URL with Puppeteer and extract data and links
 * @param {string} url - URL to process
 * @returns {Promise<Object>} - Extracted data and links
 */
async function processPuppeteerUrl(url) {
  try {
    // Fetch URL with Puppeteer
    const response = await fetchWithPuppeteer(url);

    // Extract data using our regular scraper
    const pageData = extractPageData(response.data, response.url);

    // Merge metadata from Puppeteer
    pageData.metadata = {
      ...pageData.metadata || {},
      ...response.metadata
    };

    // Extract links
    const links = extractLinks(response.data, response.url);

    return {
      pageData,
      links,
      finalUrl: response.url
    };
  } catch (error) {
    logError('Error processing URL with Puppeteer', { url, error: error.message });
    throw error;
  }
}

/**
 * Detect if a URL likely requires JavaScript rendering
 * @param {string} html - HTML content of the page
 * @returns {boolean} - Whether the page likely requires JavaScript
 */
function requiresJavaScript(html) {
  if (!html) return false;

  const $ = cheerio.load(html);

  // Check for empty body or minimal content
  const bodyText = $('body').text().trim();
  if (bodyText.length < 50) {
    return true;
  }

  // Check for common JS-only frameworks
  const angularDetected = $('[ng-app], [data-ng-app], [ng-controller], [data-ng-controller], [ng-model]').length > 0;
  const reactDetected = $('[data-reactroot], [data-reactid]').length > 0;
  const vueDetected = $('[v-app], [v-bind], [v-model], [v-if], [v-for]').length > 0;

  // Check for SPA indicators
  const spaIndicators = $('#app, #root, #application, .app, .application').length > 0 && bodyText.length < 1000;

  // Check for lazy loading
  const lazyLoading = $('[data-src], [loading="lazy"]').length > 0;

  return angularDetected || reactDetected || vueDetected || spaIndicators || lazyLoading;
}

module.exports = {
  fetchWithPuppeteer,
  processPuppeteerUrl,
  requiresJavaScript,
  closeBrowser
};
