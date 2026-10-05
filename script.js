const express = require('express');
const fs = require('fs'); // Module natif Node.js pour lire les fichiers
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const queryParams = req.query;
    let rows = '';
    for (const [key, value] of Object.entries(queryParams)) {
        rows += `<tr><td>${key}</td><td>${value}</td></tr>`;
    }
    if (rows === '') {
        rows = '<tr><td colspan="2">Aucun paramètre dans l\'URL</td></tr>';
    }
    fs.readFile('./index.html', 'utf8', (err, htmlContent) => {
        if (err) {
            res.status(500).send("Erreur : impossible de lire le fichier index.html");
            return;
        }
        const finalHtml = htmlContent.replace('<!-- TABLEAU_GET -->', rows);
        res.send(finalHtml);
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});