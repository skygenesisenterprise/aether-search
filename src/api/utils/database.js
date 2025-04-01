const { Sequelize } = require("sequelize");

// Créez une instance de Sequelize avec les informations de connexion
const sequelize = new Sequelize(
  process.env.POSTGRES_DB, // Nom de la base de données
  process.env.POSTGRES_USER, // Nom d'utilisateur
  process.env.POSTGRES_PASSWORD, // Mot de passe
  {
    host: process.env.POSTGRES_HOST, // Hôte (par exemple, localhost)
    dialect: "postgres", // Type de base de données
  }
);

// Testez la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;