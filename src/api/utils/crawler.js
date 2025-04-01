const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

// Exemple de modèle pour la base de données (à adapter selon votre configuration)
const ExampleModel = require("../models/crawlerModel");

// Ensemble pour suivre les URL déjà visitées
const visitedUrls = new Set();

/**
 * Fonction pour crawler une URL et extraire des données
 * @param {string} url - URL à crawler
 * @param {number} depth - Profondeur maximale de crawling
 */
async function crawlAndIndex(url, depth = 2) {
  if (depth === 0) {
    console.log(`Reached maximum depth for URL: ${url}`);
    return;
  }

  if (visitedUrls.has(url)) {
    console.log(`URL already visited: ${url}`);
    return;
  }

  try {
    console.log(`Crawling URL: ${url}`);
    visitedUrls.add(url);

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

    // Extraire tous les liens internes
    const links = $("a[href]")
      .map((_, element) => $(element).attr("href"))
      .get();

    // Filtrer les liens internes vers wikipedia.com
    const baseUrl = new URL(url).origin;
    const internalLinks = links
      .map((link) => new URL(link, baseUrl).href) // Résoudre les liens relatifs
      .filter((link) => link.startsWith(baseUrl) && !visitedUrls.has(link)); // Garder uniquement les liens internes non visités

    console.log(`Found ${internalLinks.length} internal links.`);

    // Crawler récursivement les liens internes
    for (const link of internalLinks) {
      await crawlAndIndex(link, depth - 1);
    }
  } catch (error) {
    console.error(`Error during crawling or indexing for URL: ${url}`, error.message);
  }
}

module.exports = { crawlAndIndex };