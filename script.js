document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            alert('Recherche effectuée pour : ' + query);
            // Ici, vous pourriez rediriger l'utilisateur vers une page de résultats
            // ou effectuer une recherche AJAX.
        } else {
            alert('Veuillez entrer une requête de recherche.');
        }
    });

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
});