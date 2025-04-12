#!/usr/bin/env node

/**
 * Command Line Interface for the Web Crawler
 */

require('dotenv').config();
const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { startCrawling, stopCrawling } = require('./api/crawler');
const config = require('./api/config');
const { setupLogging, logInfo, logError } = require('./api/services/loggingService');
const { connectToDatabase, getCrawlerStats } = require('./api/services/dbService');
const { startServer } = require('./api/server');

// Set up the program
program
  .name('web-crawler')
  .description('A modular web crawler for search engine indexing')
  .version('1.0.0');

// Command to start crawling
program
  .command('crawl')
  .description('Start crawling websites')
  .option('-u, --urls <urls>', 'Comma-separated list of seed URLs to crawl', parseUrlList)
  .option('-d, --depth <number>', 'Maximum crawl depth', parseInt)
  .option('-p, --pages <number>', 'Maximum pages to crawl', parseInt)
  .option('-c, --concurrency <number>', 'Number of concurrent crawlers', parseInt)
  .option('-r, --delay <number>', 'Delay between requests in ms', parseInt)
  .option('--respect-robots <boolean>', 'Whether to respect robots.txt', parseBoolean)
  .option('--config <path>', 'Path to a JSON configuration file')
  .action(async (options) => {
    try {
      // Initialize logging
      setupLogging();

      // Process configuration
      const crawlerConfig = processCrawlOptions(options);

      // Connect to database
      await connectToDatabase();

      // Log the configuration
      logInfo('Starting crawler with configuration', { config: crawlerConfig });

      // Start crawling
      await startCrawling(crawlerConfig.seedUrls);

      process.exit(0);
    } catch (error) {
      logError('Crawler error', { error: error.message });
      process.exit(1);
    }
  });

// Command to serve the API
program
  .command('serve')
  .description('Start the search API server')
  .option('-p, --port <number>', 'Port to listen on', parseInt, 3000)
  .action(async (options) => {
    try {
      // Initialize logging
      setupLogging();

      // Connect to database
      await connectToDatabase();

      // Start the server
      startServer(options.port);

      logInfo('Search API server started', { port: options.port });
    } catch (error) {
      logError('Server error', { error: error.message });
      process.exit(1);
    }
  });

// Command to get stats
program
  .command('stats')
  .description('Get crawler statistics')
  .action(async () => {
    try {
      // Initialize logging
      setupLogging();

      // Connect to database
      await connectToDatabase();

      // Get stats
      const stats = await getCrawlerStats();

      // Print stats as JSON
      console.log(JSON.stringify(stats, null, 2));

      process.exit(0);
    } catch (error) {
      logError('Stats error', { error: error.message });
      process.exit(1);
    }
  });

// Parse and execute
program.parse();

/**
 * Parse a comma-separated list of URLs
 * @param {string} value - Comma-separated URLs
 * @returns {Array<string>} - Array of URLs
 */
function parseUrlList(value) {
  return value.split(',').map(url => url.trim());
}

/**
 * Parse a boolean string
 * @param {string} value - Boolean string ('true', 'false')
 * @returns {boolean} - Boolean value
 */
function parseBoolean(value) {
  return value.toLowerCase() === 'true';
}

/**
 * Process crawl options and merge with config
 * @param {Object} options - Command line options
 * @returns {Object} - Processed configuration
 */
function processCrawlOptions(options) {
  // Start with default config
  const result = { ...config };

  // If config file is provided, load and merge it
  if (options.config) {
    try {
      const configPath = path.resolve(options.config);
      const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      Object.assign(result, fileConfig);
    } catch (error) {
      logError('Error loading config file', { path: options.config, error: error.message });
    }
  }

  // Override with command line options
  if (options.urls) {
    result.seedUrls = options.urls;
  }

  if (options.depth) {
    result.crawler.maxDepth = options.depth;
  }

  if (options.pages) {
    result.crawler.maxPages = options.pages;
  }

  if (options.concurrency) {
    result.crawler.concurrency = options.concurrency;
  }

  if (options.delay) {
    result.crawler.requestDelay = options.delay;
  }

  if (options.respectRobots !== undefined) {
    result.crawler.respectRobotsTxt = options.respectRobots;
  }

  return result;
}
