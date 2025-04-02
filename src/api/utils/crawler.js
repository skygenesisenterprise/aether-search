const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");
const CrawlerData = require("../models/crawlerModel"); // Modèle pour la base de données

// Ensemble pour suivre les URL déjà visitées
const visitedUrls = new Set();

/**
 * Vérifie si une URL appartient au même domaine racine
 * @param {string} url - URL à vérifier
 * @param {string} rootDomain - Domaine racine (ex: wikipedia.org)
 * @returns {boolean} - True si l'URL appartient au domaine racine
 */
function isSameRootDomain(url, rootDomain) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.endsWith(rootDomain);
  } catch {
    return false; // Si l'URL est invalide
  }
}

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
    await CrawlerData.create({
      url,
      title,
      content,
    });

    console.log(`Data indexed successfully for URL: ${url}`);

    // Extraire tous les liens internes
    const links = $("a[href]")
      .map((_, element) => $(element).attr("href"))
      .get();

    console.log(`Extracted ${links.length} links from ${url}:`);
    links.forEach((link) => console.log(`  - Raw link: ${link}`));

    // Filtrer les liens internes vers le même domaine racine
    const rootDomain = new URL(url).hostname.split('.').slice(-2).join('.'); // Ex: wikipedia.org
    const internalLinks = links
      .map((link) => {
        try {
          // Si le lien commence par "//", ajoutez le protocole
          if (link.startsWith("//")) {
            return new URL(link, `https:${link}`).href;
          }
          // Résoudre les liens relatifs et absolus
          return new URL(link, url).href;
        } catch (err) {
          console.error(`Invalid URL skipped: ${link}`);
          return null;
        }
      })
      .filter((link) => link && isSameRootDomain(link, rootDomain) && !visitedUrls.has(link)); // Garder uniquement les liens du même domaine racine non visités

    console.log(`Found ${internalLinks.length} internal links on ${url}:`);
    internalLinks.forEach((link) => console.log(`  - ${link}`));

    // Crawler récursivement les liens internes
    for (const link of internalLinks) {
      await crawlAndIndex(link, depth - 1);
    }
  } catch (error) {
    console.error(`Error during crawling for URL: ${url}`, error.message);
  }
}

module.exports = { crawlAndIndex };