require("dotenv").config(); // Charger les variables d'environnement

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const pool = require("./utils/database"); // Connexion avec pg ou Sequelize

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

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
});