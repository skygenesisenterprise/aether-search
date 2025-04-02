const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const CrawlerData = require("../models/crawlerModel"); // Modèle Sequelize pour la base de données

// Route pour effectuer une recherche
router.get("/search", async (req, res) => {
  const { query } = req.query; // Récupérer la requête utilisateur

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    // Rechercher dans la base de données les titres ou contenus correspondant à la requête
    const results = await CrawlerData.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } }, // Recherche insensible à la casse dans le titre
          { content: { [Op.iLike]: `%${query}%` } }, // Recherche insensible à la casse dans le contenu
        ],
      },
      limit: 10, // Limiter le nombre de résultats
    });

    res.json({ results });
  } catch (error) {
    console.error("Error during search:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;