require("dotenv").config(); // Charger les variables d'environnement

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const sequelize = require("./utils/database"); // Connexion Sequelize
const { crawlAndIndex } = require("./utils/crawler"); // Importer le crawler

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware global
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes principales
app.use("/api", routes);

// Middleware pour gérer les erreurs
app.use(errorHandler);

// Fonction pour démarrer le crawling continu
async function startCrawler() {
  console.log("Starting continuous crawling...");
  const startUrl = "https://www.wikipedia.com"; // URL de départ
  const maxDepth = 3; // Profondeur maximale du crawling

  // Exécuter le crawler toutes les 10 minutes
  setInterval(async () => {
    console.log("Running crawler...");
    try {
      await crawlAndIndex(startUrl, maxDepth);
      console.log("Crawling completed.");
    } catch (error) {
      console.error("Error during crawling:", error.message);
    }
  }, 10 * 60 * 1000); // 10 minutes en millisecondes
}

// Synchroniser la base de données et démarrer le serveur
sequelize
  .sync({ alter: true }) // Synchroniser les modèles avec la base de données
  .then(() => {
    console.log("Database synchronized.");
    app.listen(PORT, () => {
      console.log(`API server is running on http://localhost:${PORT}`);
      startCrawler(); // Démarrer le crawler après le lancement du serveur
    });
  })
  .catch((err) => {
    console.error("Error synchronizing the database:", err);
  });