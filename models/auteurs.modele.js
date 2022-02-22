const mongoose = require('mongoose');

const auteurSchema = mongoose.Schema({ // Schema, pour manipuler les informations provenant de la BD, qui structure les informations récupérer
    _id: mongoose.Schema.Types.ObjectId,
    nom: String, 
    prenom: String,
    age: Number,
    sexe:Boolean
})  

auteurSchema.virtual("livres", { // * Permet de faire le lien entre un auteur et les livres qu'il a écrit, prend le nom du champ qui permet d'accéder aux livres
    ref: "Livre",               // * La collection concerné
    localField: "_id",          // * Le champs présent dans cette collection, qui sert a faire le lien
    foreignField: "auteur"      // * La clé étrangère présente dans chaques livre
})
module.exports = mongoose.model("Auteur", auteurSchema);       