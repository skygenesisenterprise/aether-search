const axios = require("axios");
const cheerio = require("cheerio");
const ExampleModel = require("../models/exampleModel"); // Modèle pour la base de données

/**
 * Fonction pour crawler une URL et extraire des données
 * @param {string} url - URL à crawler
 */
async function crawlAndIndex(url) {
  try {
    console.log(`Crawling URL: ${url}`);

    // Récupérer le contenu HTML de la page
    const { data: html } = await axios.get(url);

    // Charger le HTML avec cheerio
    const $ = cheerio.load(html);

    // Extraire les données (par exemple, le titre et le contenu principal)
    const title = $("head > title").text();
    const content = $("body").text();

    console.log(`Title: ${title}`);
    console.log(`Content length: ${content.length}`);

    // Indexer les données dans la base de données
    const indexedData = await ExampleModel.create({
      url,
      title,
      content,
    });

    console.log("Data indexed successfully:", indexedData);
  } catch (error) {
    console.error("Error during crawling or indexing:", error);
  }
}

module.exports = { crawlAndIndex };