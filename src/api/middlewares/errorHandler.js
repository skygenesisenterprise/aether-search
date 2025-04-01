/**
 * Middleware de gestion des erreurs pour Express.
 * @param {Error} err - L'erreur capturée.
 * @param {Request} req - L'objet de requête Express.
 * @param {Response} res - L'objet de réponse Express.
 * @param {Function} next - La fonction suivante dans la chaîne de middlewares.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  // Définir un code de statut par défaut si non spécifié
  const statusCode = err.status || 500;

  // Construire la réponse d'erreur
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Afficher la stack uniquement en développement
  });
};

module.exports = { errorHandler };