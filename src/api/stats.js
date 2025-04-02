import { useState, useEffect } from "react";

function StatsModule() {
  const [indexedUrls, setIndexedUrls] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setIndexedUrls(data.indexedUrls);
      } catch (err) {
        setError(err.message);
      }
    };

    // Appeler l'API toutes les 5 secondes
    const interval = setInterval(fetchStats, 5000);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Erreur : {error}</p>;
  }

  return (
    <div>
      <h2>Statistiques en temps réel</h2>
      <p>Nombre d'URL indexées : {indexedUrls}</p>
    </div>
  );
}

export default StatsModule;