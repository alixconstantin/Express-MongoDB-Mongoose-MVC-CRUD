const mongoose = require('mongoose');

const livreSchema = mongoose.Schema({ //*  Schema, pour manipuler les informations provenant de la BD, qui structure les informations récupérer
    _id: mongoose.Schema.Types.ObjectId,
    nom: String, 
    auteur: {   // * Pour faire le lien entre les auteurs de la collection de livre avec la collections des auteurs => Type complexe car
            type: mongoose.Schema.Types.ObjectId,           // * object id qui fait référence a un auteur
            ref:"Auteur",                                   // * fait le lien avec la collection des auteurs
            required: true                                  // * pour dire que le champs est obligatoire
    },
    pages: Number,
    description: String, 
    image: String 
})
module.exports = mongoose.model("Livre",livreSchema); // Model qui permet de créer le document et de lire les données depuis la BD
//* Le modèle est isolé dans un dossier models ( MVC ) et placé dans un module pour être utilisable dans le routeur

 