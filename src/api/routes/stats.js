const express = require("express");
const router = express.Router();
const CrawlerData = require("../models/crawlerModel"); // Modèle Sequelize pour la base de données

/**
 * Route pour récupérer le nombre d'URL indexées
 */
router.get("/stats", async (req, res) => {
  try {
    // Compter le nombre d'URL indexées dans la base de données
    const count = await CrawlerData.count();
    res.json({ indexedUrls: count });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;