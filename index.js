require('dotenv').config();
const { startCrawling } = require('./api/crawler');
const config = require('./api/config');
const { setupLogging } = require('./api/services/loggingService');
const { connectToDatabase } = require('./api/services/dbService');

async function main() {
  try {
    // Set up logging
    setupLogging();

    // Connect to database
    await connectToDatabase();

    // Start crawling with seeds from config
    await startCrawling(config.seedUrls);

    console.log('Crawling completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main();
