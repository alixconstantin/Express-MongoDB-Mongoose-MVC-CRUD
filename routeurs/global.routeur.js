var express = require("express"); // récupère le module express
var routeur = express.Router(); // défini dans la variable routeur
const twig = require("twig"); // récupère le module twig


routeur.get("/", (requete, reponse) => {
    reponse.render("accueil.html.twig");
})

// Error gestion
routeur.use((requete, reponse, suite) => {
    const error = new Error("Page non trouvée");
    error.status = 404;
    suite(error);
})

routeur.use((error, requete, reponse) => {
    reponse.status(error.status || 500);
    reponse.end(error.message);
})

module.exports = routeur;
/*  *HELLO */