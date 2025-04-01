const express = require("express");
const { crawlAndIndex } = require("../utils/crawler");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Route pour démarrer le crawler
router.post("/crawl", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    await crawlAndIndex(url);
    res.status(200).json({ message: "Crawling and indexing completed successfully" });
  } catch (error) {
    console.error("Error in /crawl route:", error);
    res.status(500).json({ error: "Failed to crawl and index the URL" });
  }
});

module.exports = router;