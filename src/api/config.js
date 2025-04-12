/**
 * Configuration settings for the web crawler
 */

module.exports = {
  // Seed URLs to start crawling from
  seedUrls: [
    'https://example.com',
    'https://example.org'
  ],

  // Crawling settings
  crawler: {
    // Maximum number of pages to crawl
    maxPages: process.env.MAX_PAGES || 100,

    // Maximum depth to crawl (0 = only crawl seed URLs)
    maxDepth: process.env.MAX_DEPTH || 3,

    // Delay between requests in milliseconds
    requestDelay: process.env.REQUEST_DELAY || 1000,

    // Maximum concurrent requests
    concurrency: process.env.CONCURRENCY || 5,

    // User agent to use for requests
    userAgent: process.env.USER_AGENT || 'MySearchCrawler/1.0 (+https://example.com/bot)',

    // Whether to respect robots.txt
    respectRobotsTxt: process.env.RESPECT_ROBOTS !== 'false',

    // Whether to follow redirects
    followRedirects: true,

    // Timeout for requests in milliseconds
    timeout: process.env.REQUEST_TIMEOUT || 10000,

    // Maximum pages to crawl per domain
    maxPagesPerDomain: process.env.MAX_PAGES_PER_DOMAIN || 1000,

    // Support for JavaScript rendering with Puppeteer
    puppeteer: {
      // Whether to enable Puppeteer for JavaScript rendering
      enabled: process.env.ENABLE_PUPPETEER === 'true',

      // Auto-detect if a page requires JavaScript
      autoDetect: process.env.PUPPETEER_AUTO_DETECT === 'true',

      // Wait time after page load in milliseconds
      waitTime: process.env.PUPPETEER_WAIT_TIME || 1000,

      // URL patterns that should always use Puppeteer
      urlPatterns: [
        '\\.js$',
        '(angular|react|vue)',
        'spa',
        'single-page'
      ]
    },

    // Priority crawling settings
    priority: {
      // Whether to enable priority-based crawling
      enabled: process.env.ENABLE_PRIORITY === 'true',

      // Important domains with priority values (0-10)
      importantDomains: [
        // Examples: { domain: 'example.com', importance: 10 }
      ],

      // URL patterns with importance values
      importantPatterns: [
        { pattern: 'sitemap', importance: 9 },
        { pattern: '/index.html', importance: 8 },
        { pattern: '/about', importance: 7 },
        { pattern: '/blog', importance: 6 }
      ]
    }
  },

  // Database settings
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'crawler_db',
    collections: {
      pages: 'pages',
      urls: 'urls',
      errors: 'errors'
    }
  },

  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    directory: process.env.LOG_DIR || './logs'
  },

  // API server settings
  server: {
    port: process.env.API_PORT || 3000,
    host: process.env.API_HOST || '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN || '*'
    }
  }
};
