/**
 * Search API server for the crawler
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('./config');
const { logInfo, logError } = require('./services/loggingService');

// Express app
let app;
let server;

/**
 * Start the search API server
 * @param {number} port - Port to listen on
 * @returns {Object} - Express app and server
 */
function startServer(port = 3000) {
  // Create Express app
  app = express();

  // Apply middleware
  app.use(cors());
  app.use(bodyParser.json());

  // Set up routes
  setupRoutes(app);

  // Start server
  server = app.listen(port, () => {
    logInfo(`Search API server running on port ${port}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    logInfo('Shutting down server');
    server.close();
    process.exit(0);
  });

  return { app, server };
}

/**
 * Set up API routes
 * @param {Object} app - Express app
 */
function setupRoutes(app) {
  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'Web Crawler Search API',
      version: '1.0.0',
      endpoints: [
        { path: '/search', method: 'GET', description: 'Search crawled pages' },
        { path: '/pages', method: 'GET', description: 'Get all crawled pages with pagination' },
        { path: '/pages/:id', method: 'GET', description: 'Get a specific page by ID' },
        { path: '/stats', method: 'GET', description: 'Get crawler statistics' }
      ]
    });
  });

  // Search endpoint
  app.get('/search', async (req, res) => {
    try {
      const { q, limit = 10, offset = 0 } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }

      const client = new MongoClient(config.database.uri);
      await client.connect();
      const db = client.db(config.database.name);
      const collection = db.collection(config.database.collections.pages);

      // Perform text search
      const results = await collection.find(
        { $text: { $search: q } },
        {
          score: { $meta: 'textScore' },
          // Limit fields to return
          projection: {
            url: 1,
            title: 1,
            description: 1,
            bodyText: { $substrCP: ['$bodyText', 0, 200] }, // Snippet
            timestamp: 1
          }
        }
      )
      .sort({ score: { $meta: 'textScore' } })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .toArray();

      // Get total count
      const total = await collection.countDocuments({ $text: { $search: q } });

      await client.close();

      res.json({
        query: q,
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
        results
      });
    } catch (error) {
      logError('Search error', { error: error.message });
      res.status(500).json({ error: 'An error occurred during search' });
    }
  });

  // Get all pages with pagination
  app.get('/pages', async (req, res) => {
    try {
      const { limit = 10, offset = 0, domain } = req.query;

      const client = new MongoClient(config.database.uri);
      await client.connect();
      const db = client.db(config.database.name);
      const collection = db.collection(config.database.collections.pages);

      // Build query
      const query = {};
      if (domain) {
        query.url = { $regex: new RegExp(`^https?://(www\\.)?${domain}`) };
      }

      // Get pages
      const pages = await collection.find(query)
        .sort({ timestamp: -1 })
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .project({
          url: 1,
          title: 1,
          description: 1,
          timestamp: 1
        })
        .toArray();

      // Get total count
      const total = await collection.countDocuments(query);

      await client.close();

      res.json({
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
        pages
      });
    } catch (error) {
      logError('Pages listing error', { error: error.message });
      res.status(500).json({ error: 'An error occurred while retrieving pages' });
    }
  });

  // Get a specific page by ID
  app.get('/pages/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const client = new MongoClient(config.database.uri);
      await client.connect();
      const db = client.db(config.database.name);
      const collection = db.collection(config.database.collections.pages);

      // Get page
      const page = await collection.findOne({ _id: id });

      await client.close();

      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      res.json(page);
    } catch (error) {
      logError('Page retrieval error', { error: error.message, id: req.params.id });
      res.status(500).json({ error: 'An error occurred while retrieving the page' });
    }
  });

  // Get crawler statistics
  app.get('/stats', async (req, res) => {
    try {
      const client = new MongoClient(config.database.uri);
      await client.connect();
      const db = client.db(config.database.name);

      // Get collection stats
      const stats = {
        pages: {
          count: await db.collection(config.database.collections.pages).countDocuments(),
          domains: (await db.collection(config.database.collections.pages).distinct('domain')).length
        },
        urls: {
          count: await db.collection(config.database.collections.urls).countDocuments(),
          pending: await db.collection(config.database.collections.urls).countDocuments({ status: 'pending' }),
          completed: await db.collection(config.database.collections.urls).countDocuments({ status: 'completed' }),
          error: await db.collection(config.database.collections.urls).countDocuments({ status: 'error' })
        },
        errors: await db.collection(config.database.collections.errors).countDocuments()
      };

      await client.close();

      res.json(stats);
    } catch (error) {
      logError('Stats error', { error: error.message });
      res.status(500).json({ error: 'An error occurred while retrieving statistics' });
    }
  });

  // Handle 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    logError('API error', { error: err.message, path: req.path });
    res.status(500).json({ error: 'Internal server error' });
  });
}

module.exports = {
  startServer
};
