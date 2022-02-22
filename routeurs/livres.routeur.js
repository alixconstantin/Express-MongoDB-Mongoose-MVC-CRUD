var express = require("express"); // récupère le module express
var routeur = express.Router(); // défini dans la variable routeur
const twig = require("twig"); // récupère le module twig
const livreController = require('../controllers/livre.controller');

const multer = require("multer");
const storage = multer.diskStorage({ //* IMAGE Destination et nommage
    destination: (req, file, cb) => {
        cb(null, "./public/images/")
    },
    filename: (req, file, cb) => {
        var date = new Date().toLocaleDateString().replace(/\//g, '-');
        cb(null, date + "-" + Math.round(Math.random() * 10000) + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => { //* IMAGE Type de fichier accepter 
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(new Error("L'image n'est pas accepter"), false)
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


// * Affichage de la liste des livres
routeur.get("/", livreController.livres_affichage) 

// * Création d'un livre et d'une image
routeur.post("/", upload.single("image"), livreController.livres_ajout)

//* Affichage détaillé d'un livre
routeur.get("/:id", livreController.livre_affichage)

//*   Modification d'un livre ( route du formulaire )
routeur.get("/modification/:id", livreController.livre_routeModification)

//* Modification d'un livre ( envoie du formulaire )
routeur.post("/modificationServer", livreController.livre_modification)

//* Suppression d'un livre depuis la liste
routeur.post("/delete/:id", livreController.livre_suppression)

//* Changement d'image
routeur.post('/updateImage', upload.single("image"), livreController.livre_modification_image);



module.exports = routeur;
/*  *HELLO */