/**
 * Logging service for the crawler
 */

const winston = require('winston');
const fs = require('fs');
const path = require('path');
const config = require('../config');

let logger;

/**
 * Set up the logging service
 */
function setupLogging() {
  // Create logs directory if it doesn't exist
  const logDir = config.logging.directory;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Define log format
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  );

  // Create logger
  logger = winston.createLogger({
    level: config.logging.level,
    format: logFormat,
    defaultMeta: { service: 'web-crawler' },
    transports: [
      // Write logs to console and files
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log')
      })
    ]
  });

  logger.info('Logging service initialized');
  return logger;
}

/**
 * Log an info message
 * @param {string} message - The log message
 * @param {Object} meta - Additional metadata
 */
function logInfo(message, meta = {}) {
  if (!logger) setupLogging();
  logger.info(message, meta);
}

/**
 * Log a warning message
 * @param {string} message - The log message
 * @param {Object} meta - Additional metadata
 */
function logWarning(message, meta = {}) {
  if (!logger) setupLogging();
  logger.warn(message, meta);
}

/**
 * Log an error message
 * @param {string} message - The log message
 * @param {Object} meta - Additional metadata
 */
function logError(message, meta = {}) {
  if (!logger) setupLogging();
  logger.error(message, meta);
}

/**
 * Log a debug message
 * @param {string} message - The log message
 * @param {Object} meta - Additional metadata
 */
function logDebug(message, meta = {}) {
  if (!logger) setupLogging();
  logger.debug(message, meta);
}

/**
 * Log crawler statistics
 * @param {Object} stats - Crawler statistics
 */
function logCrawlStats(stats) {
  if (!logger) setupLogging();
  logger.info('Crawler statistics', { stats });
}

module.exports = {
  setupLogging,
  logInfo,
  logWarning,
  logError,
  logDebug,
  logCrawlStats
};
