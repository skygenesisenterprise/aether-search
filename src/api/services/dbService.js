/**
 * Database service for the crawler
 */

const { MongoClient } = require('mongodb');
const config = require('../config');
const { logInfo, logError } = require('./loggingService');
const { generateUrlId } = require('../utils');

let client;
let db;
let collections = {};

/**
 * Connect to the MongoDB database
 * @returns {Promise<Object>} - MongoDB database connection
 */
async function connectToDatabase() {
  try {
    // If already connected, return the existing connection
    if (db) return db;

    // Create a new MongoDB client
    client = new MongoClient(config.database.uri);

    // Connect to the server
    await client.connect();

    // Get database reference
    db = client.db(config.database.name);

    // Initialize collections
    collections = {
      pages: db.collection(config.database.collections.pages),
      urls: db.collection(config.database.collections.urls),
      errors: db.collection(config.database.collections.errors)
    };

    // Create indexes
    await collections.urls.createIndex({ url: 1 }, { unique: true });
    await collections.pages.createIndex({ url: 1 }, { unique: true });
    await collections.pages.createIndex({ title: 'text', bodyText: 'text' });

    logInfo('Connected to MongoDB', { database: config.database.name });

    return db;
  } catch (error) {
    logError('MongoDB connection error', { error: error.message });
    throw error;
  }
}

/**
 * Close the database connection
 * @returns {Promise<void>}
 */
async function closeConnection() {
  if (client) {
    await client.close();
    logInfo('MongoDB connection closed');
  }
}

/**
 * Save a URL to the database for crawling
 * @param {string} url - The URL to save
 * @param {number} depth - Current crawl depth
 * @param {string} parentUrl - The parent URL
 * @returns {Promise<Object>} - The saved URL document
 */
async function saveUrl(url, depth = 0, parentUrl = null) {
  try {
    if (!db) await connectToDatabase();

    const urlDoc = {
      _id: generateUrlId(url),
      url,
      status: 'pending', // pending, completed, error
      depth,
      parentUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collections.urls.updateOne(
      { _id: urlDoc._id },
      { $set: urlDoc },
      { upsert: true }
    );

    return urlDoc;
  } catch (error) {
    // Ignore duplicate key errors (already saved URLs)
    if (error.code !== 11000) {
      logError('Error saving URL to database', { url, error: error.message });
    }
    return null;
  }
}

/**
 * Update URL status in the database
 * @param {string} url - The URL to update
 * @param {string} status - New status (pending, completed, error)
 * @returns {Promise<void>}
 */
async function updateUrlStatus(url, status) {
  try {
    if (!db) await connectToDatabase();

    await collections.urls.updateOne(
      { url },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    );
  } catch (error) {
    logError('Error updating URL status', { url, status, error: error.message });
  }
}

/**
 * Get the next URL to crawl
 * @param {number} maxDepth - Maximum crawl depth
 * @returns {Promise<Object|null>} - Next URL to crawl or null
 */
async function getNextUrl(maxDepth) {
  try {
    if (!db) await connectToDatabase();

    // Find a URL that hasn't been crawled yet and is within depth limit
    const urlDoc = await collections.urls.findOneAndUpdate(
      {
        status: 'pending',
        depth: { $lte: maxDepth }
      },
      {
        $set: {
          status: 'processing',
          updatedAt: new Date()
        }
      },
      { sort: { depth: 1, createdAt: 1 } }
    );

    return urlDoc.value;
  } catch (error) {
    logError('Error getting next URL', { error: error.message });
    return null;
  }
}

/**
 * Save crawled page data to the database
 * @param {Object} pageData - Page data from scraper
 * @returns {Promise<Object>} - The saved page document
 */
async function savePage(pageData) {
  try {
    if (!db) await connectToDatabase();

    const pageDoc = {
      _id: generateUrlId(pageData.url),
      ...pageData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collections.pages.updateOne(
      { _id: pageDoc._id },
      { $set: pageDoc },
      { upsert: true }
    );

    return pageDoc;
  } catch (error) {
    logError('Error saving page to database', { url: pageData.url, error: error.message });
    return null;
  }
}

/**
 * Log crawl error to database
 * @param {string} url - The URL that caused the error
 * @param {Error} error - The error object
 * @returns {Promise<void>}
 */
async function logCrawlError(url, error) {
  try {
    if (!db) await connectToDatabase();

    const errorDoc = {
      url,
      message: error.message,
      stack: error.stack,
      timestamp: new Date()
    };

    await collections.errors.insertOne(errorDoc);
  } catch (dbError) {
    logError('Error logging to database', { url, error: dbError.message });
  }
}

/**
 * Get crawler statistics
 * @returns {Promise<Object>} - Statistics object
 */
async function getCrawlerStats() {
  try {
    if (!db) await connectToDatabase();

    const stats = {
      urls: {
        total: await collections.urls.countDocuments(),
        pending: await collections.urls.countDocuments({ status: 'pending' }),
        completed: await collections.urls.countDocuments({ status: 'completed' }),
        error: await collections.urls.countDocuments({ status: 'error' }),
        processing: await collections.urls.countDocuments({ status: 'processing' })
      },
      pages: await collections.pages.countDocuments(),
      errors: await collections.errors.countDocuments()
    };

    return stats;
  } catch (error) {
    logError('Error getting crawler stats', { error: error.message });
    return {};
  }
}

module.exports = {
  connectToDatabase,
  closeConnection,
  saveUrl,
  updateUrlStatus,
  getNextUrl,
  savePage,
  logCrawlError,
  getCrawlerStats
};
