/**
 * Web scraping logic for parsing HTML content
 */

const cheerio = require('cheerio');
const { normalizeUrl } = require('./utils');
const { logError } = require('./services/loggingService');

/**
 * Extract data from an HTML page
 * @param {string} html - HTML content
 * @param {string} url - URL of the page
 * @returns {Object} - Extracted data
 */
function extractPageData(html, url) {
  try {
    const $ = cheerio.load(html);

    // Extract title
    const title = $('title').text().trim() || '';

    // Extract meta description
    const description = $('meta[name="description"]').attr('content') ||
                        $('meta[property="og:description"]').attr('content') || '';

    // Extract meta keywords
    const keywords = $('meta[name="keywords"]').attr('content') || '';

    // Extract headings
    const h1 = $('h1').map((i, el) => $(el).text().trim()).get();
    const h2 = $('h2').map((i, el) => $(el).text().trim()).get();

    // Extract main content text (excluding scripts, styles, etc.)
    const bodyText = $('body')
      .clone()
      .find('script, style, noscript, iframe, object')
      .remove()
      .end()
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    // Extract structured data (JSON-LD)
    const structuredData = [];
    $('script[type="application/ld+json"]').each((i, element) => {
      try {
        const json = JSON.parse($(element).html());
        structuredData.push(json);
      } catch (e) {
        // Ignore invalid JSON
      }
    });

    // Get all images with alt text and src
    const images = $('img').map((i, el) => ({
      src: $(el).attr('src'),
      alt: $(el).attr('alt') || '',
      title: $(el).attr('title') || ''
    })).get();

    return {
      url,
      title,
      description,
      keywords,
      h1,
      h2,
      bodyText,
      structuredData,
      images,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logError('Error extracting data from page', { url, error: error.message });
    return {
      url,
      title: '',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Extract links from an HTML page
 * @param {string} html - HTML content
 * @param {string} baseUrl - Base URL for resolving relative links
 * @returns {Array<string>} - Array of normalized links
 */
function extractLinks(html, baseUrl) {
  try {
    const $ = cheerio.load(html);
    const links = new Set();

    // Get all links from a, link tags
    $('a, link[rel="canonical"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href) {
        const normalizedUrl = normalizeUrl(href, baseUrl);
        if (normalizedUrl) {
          links.add(normalizedUrl);
        }
      }
    });

    return Array.from(links);
  } catch (error) {
    logError('Error extracting links', { url: baseUrl, error: error.message });
    return [];
  }
}

/**
 * Check if a URL should be crawled based on content type
 * @param {string} contentType - Content type header
 * @returns {boolean} - Whether the URL should be crawled
 */
function shouldCrawlContentType(contentType) {
  if (!contentType) return false;

  // Only crawl HTML and XHTML content
  return contentType.includes('text/html') || contentType.includes('application/xhtml+xml');
}

module.exports = {
  extractPageData,
  extractLinks,
  shouldCrawlContentType
};
