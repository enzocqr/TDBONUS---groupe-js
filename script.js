const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Permet de lire le corps des requêtes POST (formulaire classique ou JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Évite qu'une valeur saisie soit interprétée comme du HTML (faille XSS)
function echapper(valeur) {
    return String(valeur)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Transforme un objet en lignes de tableau HTML
function construireLignes(objet, messageVide) {
    let rows = '';
    for (const [key, value] of Object.entries(objet)) {
        rows += `<tr><td>${echapper(key)}</td><td>${echapper(value)}</td></tr>`;
    }
    if (rows === '') {
        rows = `<tr><td colspan="2">${messageVide}</td></tr>`;
    }
    return rows;
}

// Lit helloworld.html, remplace les deux marqueurs et envoie la page
function envoyerPage(res, rowsGet, rowsPost) {
    fs.readFile('./helloworld.html', 'utf8', (err, htmlContent) => {
        if (err) {
            res.status(500).send('Erreur : impossible de lire le fichier helloworld.html');
            return;
        }
        const finalHtml = htmlContent
            .replace('<!-- TABLEAU_GET -->', () => rowsGet)
            .replace('<!-- TABLEAU_POST -->', () => rowsPost);
        res.send(finalHtml);
    });
}

// GET : affiche les paramètres de l'URL
app.get('/', (req, res) => {
    const rowsGet = construireLignes(req.query, "Aucun paramètre dans l'URL");
    const rowsPost = construireLignes({}, 'Aucune donnée POST reçue');
    envoyerPage(res, rowsGet, rowsPost);
});

// POST : affiche les données envoyées par le formulaire
app.post('/', (req, res) => {
    const rowsGet = construireLignes({}, "Aucun paramètre dans l'URL");
    const rowsPost = construireLignes(req.body, 'Aucune donnée POST reçue');
    envoyerPage(res, rowsGet, rowsPost);
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});