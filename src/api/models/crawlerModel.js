const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database"); // Importer l'instance Sequelize

// Définir le modèle pour les données collectées par le crawler
const CrawlerData = sequelize.define("CrawlerData", {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Empêche les doublons d'URL dans la base de données
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // Utilisé pour stocker de grandes quantités de texte
    allowNull: false,
  },
  crawledAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Enregistre la date et l'heure du crawling
  },
});

module.exports = CrawlerData;