/**
 * Utility functions for the web crawler
 */

const axios = require('axios');
const url = require('url');
const robotsParser = require('robots-parser');
const config = require('./config');
const { logError } = require('./services/loggingService');

// Cache for robots.txt files
const robotsCache = new Map();

/**
 * Normalize a URL
 * @param {string} urlStr - The URL to normalize
 * @param {string} baseUrl - The base URL for resolving relative URLs
 * @returns {string|null} - The normalized URL or null if invalid
 */
function normalizeUrl(urlStr, baseUrl) {
  try {
    // Handle relative URLs
    const parsedUrl = new URL(urlStr, baseUrl);

    // Remove trailing slashes, fragments, and normalize
    let normalized = parsedUrl.origin + parsedUrl.pathname.replace(/\/$/, '');
    if (parsedUrl.search) {
      normalized += parsedUrl.search;
    }
    return normalized;
  } catch (error) {
    return null; // Invalid URL
  }
}

/**
 * Check if a URL is allowed by robots.txt
 * @param {string} urlStr - The URL to check
 * @returns {Promise<boolean>} - Whether the URL is allowed
 */
async function isAllowedByRobots(urlStr) {
  if (!config.crawler.respectRobotsTxt) {
    return true;
  }

  try {
    const parsedUrl = new URL(urlStr);
    const robotsUrl = `${parsedUrl.origin}/robots.txt`;

    // Check if we've already fetched this robots.txt
    if (!robotsCache.has(robotsUrl)) {
      try {
        const response = await axios.get(robotsUrl, {
          timeout: config.crawler.timeout,
          headers: { 'User-Agent': config.crawler.userAgent }
        });
        const robots = robotsParser(robotsUrl, response.data);
        robotsCache.set(robotsUrl, robots);
      } catch (error) {
        // If we can't fetch robots.txt, assume everything is allowed
        robotsCache.set(robotsUrl, null);
      }
    }

    const robots = robotsCache.get(robotsUrl);
    if (!robots) {
      return true;
    }

    return robots.isAllowed(urlStr, config.crawler.userAgent);
  } catch (error) {
    logError('Error checking robots.txt', { url: urlStr, error: error.message });
    return false;
  }
}

/**
 * Fetch a URL and return the response
 * @param {string} url - The URL to fetch
 * @returns {Promise<Object>} - The response data
 */
async function fetchUrl(url) {
  try {
    const response = await axios.get(url, {
      timeout: config.crawler.timeout,
      headers: {
        'User-Agent': config.crawler.userAgent
      },
      maxRedirects: config.crawler.followRedirects ? 5 : 0
    });

    return {
      url,
      status: response.status,
      headers: response.headers,
      data: response.data,
      contentType: response.headers['content-type']
    };
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

/**
 * Delay execution for a specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a unique ID for a URL
 * @param {string} url - The URL
 * @returns {string} - A URL hash
 */
function generateUrlId(url) {
  // Simple hash function for URLs
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * Extract domain from URL
 * @param {string} urlStr - The URL
 * @returns {string} - The domain
 */
function extractDomain(urlStr) {
  try {
    const parsedUrl = new URL(urlStr);
    return parsedUrl.hostname;
  } catch (error) {
    return null;
  }
}

module.exports = {
  normalizeUrl,
  isAllowedByRobots,
  fetchUrl,
  delay,
  generateUrlId,
  extractDomain
};
