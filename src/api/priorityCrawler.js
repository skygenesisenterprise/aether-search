/**
 * Priority-based crawling system
 */

const { URL } = require('url');
const config = require('./config');
const { logInfo, logError } = require('./services/loggingService');
const { extractDomain } = require('./utils');

/**
 * Priority Queue for URLs
 */
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  /**
   * Add a URL with priority to the queue
   * @param {string} url - URL to add
   * @param {number} priority - Priority value (lower = higher priority)
   * @param {Object} metadata - Additional metadata for the URL
   */
  enqueue(url, priority, metadata = {}) {
    const queueItem = { url, priority, metadata };

    // If queue is empty or priority is higher than the last item
    if (this.isEmpty() || priority > this.items[this.items.length - 1].priority) {
      this.items.push(queueItem);
      return;
    }

    // Find the correct position based on priority
    for (let i = 0; i < this.items.length; i++) {
      if (priority <= this.items[i].priority) {
        this.items.splice(i, 0, queueItem);
        return;
      }
    }
  }

  /**
   * Get the highest priority URL
   * @returns {Object|null} - The highest priority URL item or null if empty
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  /**
   * Check if the queue is empty
   * @returns {boolean} - Whether the queue is empty
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get the length of the queue
   * @returns {number} - Queue length
   */
  size() {
    return this.items.length;
  }

  /**
   * Check if a URL is already in the queue
   * @param {string} url - URL to check
   * @returns {boolean} - Whether the URL is in the queue
   */
  contains(url) {
    return this.items.some(item => item.url === url);
  }

  /**
   * Get all items in the queue
   * @returns {Array} - All queue items
   */
  getAll() {
    return [...this.items];
  }
}

/**
 * Prioritize URLs based on various factors
 * @param {string} url - URL to prioritize
 * @param {Object} options - Options for prioritization
 * @returns {number} - Priority score (lower = higher priority)
 */
function calculateUrlPriority(url, options = {}) {
  const {
    depth = 0,
    parentUrl = null,
    parentImportance = 0,
    urlImportanceMap = new Map(),
    domainImportanceMap = new Map()
  } = options;

  let priority = 100; // Default base priority

  try {
    const urlObj = new URL(url);
    const domain = extractDomain(url);
    const path = urlObj.pathname;

    // 1. Adjust priority based on depth - higher depths get lower priority
    priority += depth * 10;

    // 2. Adjust for domain importance
    const domainImportance = domainImportanceMap.get(domain) || 0;
    priority -= domainImportance * 20;

    // 3. Adjust for URL-specific importance
    const urlImportance = urlImportanceMap.get(url) || 0;
    priority -= urlImportance * 30;

    // 4. Adjust for parent page importance
    priority -= parentImportance * 5;

    // 5. Prioritize shorter paths (typically more important pages)
    const pathSegments = path.split('/').filter(Boolean);
    priority += pathSegments.length * 5;

    // 6. Prioritize certain URL patterns
    if (path.match(/\/(index|home|main)(\.(html|php|asp))?$/i)) {
      priority -= 15; // Home pages are important
    }

    if (path.match(/\/(about|contact|faq)(\.(html|php|asp))?$/i)) {
      priority -= 10; // Important informational pages
    }

    if (path.match(/\/(blog|news|article)s?\//i)) {
      priority -= 5; // Content pages are somewhat important
    }

    // 7. Deprioritize certain URL patterns
    if (path.match(/\/(tag|category|archive|search)/i)) {
      priority += 20; // Less important navigational pages
    }

    if (path.match(/\/page\/\d+/i) || path.includes('?page=')) {
      priority += 15; // Pagination pages
    }

    if (path.match(/\.(jpg|jpeg|png|gif|css|js)$/i)) {
      priority += 50; // Deprioritize static assets
    }

    // 8. Special cases
    if (url.includes('sitemap')) {
      priority -= 50; // Sitemaps are very important for discovery
    }

    return priority;
  } catch (error) {
    logError('Error calculating URL priority', { url, error: error.message });
    return priority; // Return default priority on error
  }
}

/**
 * Priority URL Manager for crawling
 */
class PriorityUrlManager {
  constructor() {
    this.queue = new PriorityQueue();
    this.visited = new Set();
    this.domainImportance = new Map();
    this.urlImportance = new Map();
    this.domainLimits = new Map();
  }

  /**
   * Initialize the manager with seed URLs
   * @param {Array<string>} seedUrls - Initial URLs to crawl
   * @param {Array<Object>} importantDomains - Domains with importance
   */
  initialize(seedUrls, importantDomains = []) {
    // Set domain importance
    importantDomains.forEach(item => {
      this.domainImportance.set(item.domain, item.importance);
    });

    // Add seed URLs with high priority
    seedUrls.forEach(url => {
      this.addUrl(url, { depth: 0, initialSeed: true });
    });

    logInfo('Priority URL Manager initialized', {
      seedUrls: seedUrls.length,
      importantDomains: importantDomains.length
    });
  }

  /**
   * Add a URL to the queue
   * @param {string} url - URL to add
   * @param {Object} options - Options for the URL
   * @returns {boolean} - Whether the URL was added
   */
  addUrl(url, options = {}) {
    const {
      depth = 0,
      parentUrl = null,
      parentImportance = 0,
      initialSeed = false
    } = options;

    // Skip if already visited or in queue
    if (this.visited.has(url) || this.queue.contains(url)) {
      return false;
    }

    // Calculate priority
    let priority;
    if (initialSeed) {
      priority = 0; // Highest priority for initial seeds
    } else {
      priority = calculateUrlPriority(url, {
        depth,
        parentUrl,
        parentImportance,
        urlImportanceMap: this.urlImportance,
        domainImportanceMap: this.domainImportance
      });
    }

    // Check domain crawl limits
    const domain = extractDomain(url);
    const domainCount = this.getDomainCount(domain);
    const domainLimit = this.domainLimits.get(domain) || config.crawler.maxPagesPerDomain || 1000;

    if (domainCount >= domainLimit && !initialSeed) {
      logInfo('Domain limit reached', { domain, limit: domainLimit });
      return false;
    }

    // Add to queue
    this.queue.enqueue(url, priority, { depth, parentUrl });
    return true;
  }

  /**
   * Get the next URL to crawl
   * @returns {Object|null} - Next URL to crawl
   */
  getNextUrl() {
    if (this.queue.isEmpty()) {
      return null;
    }

    const item = this.queue.dequeue();
    this.visited.add(item.url);

    return {
      url: item.url,
      depth: item.metadata.depth,
      parentUrl: item.metadata.parentUrl,
      priority: item.priority
    };
  }

  /**
   * Get count of URLs for a domain
   * @param {string} domain - Domain to count
   * @returns {number} - Count of URLs for the domain
   */
  getDomainCount(domain) {
    let count = 0;

    // Count in visited
    for (const url of this.visited) {
      if (extractDomain(url) === domain) {
        count++;
      }
    }

    // Count in queue
    for (const item of this.queue.getAll()) {
      if (extractDomain(item.url) === domain) {
        count++;
      }
    }

    return count;
  }

  /**
   * Set domain crawl limits
   * @param {string} domain - Domain to limit
   * @param {number} limit - Maximum pages to crawl for this domain
   */
  setDomainLimit(domain, limit) {
    this.domainLimits.set(domain, limit);
  }

  /**
   * Set URL importance
   * @param {string} url - URL to set importance for
   * @param {number} importance - Importance value (0-10)
   */
  setUrlImportance(url, importance) {
    this.urlImportance.set(url, importance);
  }

  /**
   * Set domain importance
   * @param {string} domain - Domain to set importance for
   * @param {number} importance - Importance value (0-10)
   */
  setDomainImportance(domain, importance) {
    this.domainImportance.set(domain, importance);
  }

  /**
   * Get queue statistics
   * @returns {Object} - Statistics about the queue
   */
  getStats() {
    return {
      queueSize: this.queue.size(),
      visitedCount: this.visited.size,
      domainsVisited: new Set([...this.visited].map(url => extractDomain(url))).size
    };
  }
}

module.exports = {
  PriorityUrlManager,
  calculateUrlPriority
};
