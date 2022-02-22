const express = require("express"); // récupère le module Express
const server = express();           // place Express dans un variable server
const morgan = require("morgan");   // récupère le module morgan
const routerLivre = require("./routeurs/livres.routeur"); // récupère le module route dans dossier  -> routeurs
const routerGlobal = require("./routeurs/global.routeur"); // récupère le module route dans dossier  -> routeurs
const routerAuteur = require("./routeurs/auteurs.routeur"); // récupère le module route dans dossier  -> routeurs
const mongoose = require("mongoose"); // récupère mongoose pour liaison express et mongoDb
const bodyParser = require("body-parser"); // récupère le module blabla
const session = require("express-session"); // récupère le module


server.set('trust proxy', 1);
server.use( session ({ 
    secret : 'keyboard cat' , 
    resave : true , 
    saveUninitialized : true , 
    cookie : {  maxAge:60000  } 
  }))  // pris sur la doc du middleware
  

mongoose.connect("mongodb://localhost/biblio", {useNewUrlParser: true, useUnifiedTopology: true}); //  connexion a la BDD

server.use(express.static("public"))  // Pour servir des fichiers statiques tels que les images, les fichiers CSS et les fichiers JavaScript
server.use(morgan("date")); // 
server.use(bodyParser.urlencoded({ extended:false })); 



server.use((requete, reponse, suite) => {
  reponse.locals.message = requete.session.message;
  delete requete.session.message;
  suite();
})
server.use("/livres",routerLivre);
server.use("/auteurs",routerAuteur);
server.use("/",routerGlobal);

server.listen(3000);

