const mongoose = require("mongoose");
const auteurSchema = require("../models/auteurs.modele");
const livreSchema = require("../models/livres.modele"); // n'est utilisé que dans la suppresion sur ce controlleur
const fs = require("fs");


exports.auteur_affichage = (req, res) => {
    auteurSchema.findById(req.params.id)
    .populate('livres') // * Permet d'accéder a un tableau de livre
    .exec()
    .then(auteur => { 
        console.log(auteur);
        res.render("auteurs/auteur.html.twig", {auteur : auteur});
    })
    .catch(err => {
        console.log(err);
    })     
} 
 
exports.auteurs_affichage = (req, res) => {
    auteurSchema.find()
    .populate("livres")
    .exec()
    .then(auteurs => {
        console.log(auteurs);
        res.render("auteurs/list.html.twig", {auteurs : auteurs, isModification : false}); 
    })
    .catch(err => {
        console.log(err);
    }) 
    
}

exports.auteurs_ajout = (req, res) => {
    const newAuteur = new auteurSchema ({
        _id: new mongoose.Types.ObjectId(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        age: req.body.age,
        sexe: (req.body.sexe) ? true : false //* ternaire pour obtenir un true / false 
    })

    newAuteur.save()
    .then(resultat => {
        res.redirect("/auteurs");
    })
    .catch(err => {
        console.error(err);
    })
}

exports.auteur_suppression = (req, res) => {
    auteurSchema.find()
    .where("nom").equals("anonyme") //* où "nom" est égale "equals"
    .exec()
    .then(auteur => {              //* supprime sur l'objet livre son nom d'auteur, et le rempalce par anonyme si le livre existe
        console.log(auteur)
        livreSchema.updateMany({"auteur": req.params.id}, {"$set": {"auteur": auteur[0]._id}},{"multi":true} ) //* updateMany pour tous les modifier
        .exec()                                                                                             //* $set indique que c'est une modification ( auteur supprimé = anonyme et pas rien)
        .then(                                                                                              //* multi indique c'est une opération multiple a réaliser
            auteurSchema.remove({_id:req.params.id}) //* supprime le nom d'auteur
            .where("nom").ne("anonyme")  // * ne = not equals, pour ne pas pouvoir supprimer anonyme
            .exec()
            .then(res.redirect("/auteurs"))
            .catch(err =>{
                console.log(err);
            })
        )                                                                                               
    })                                                                                                         

    .catch(err => {
        console.error(err);
    })
}

exports.auteur_modification = (req, res) => {
    auteurSchema.findById(req.params.id)
    .populate("livres")
    .exec()
    .then( auteur => {
        console.log(auteur);
        res.render("auteurs/auteur.html.twig", {auteur : auteur, isModification : true});
    })
    .catch(err => {
        console.log(err);
    })
}

exports.auteur_modification_validation = (req, res) => {
    const auteurUpdate = {
        nom : req.body.nom,
        prenom : req.body.prenom,
        age : req.body.age,
        sexe : (req.body.sexe) ? true : false
    }
    auteurSchema.update({_id:req.body.identifiant}, auteurUpdate)
    .exec()
    .then(resultat => {
        console.log(resultat);
        if(resultat.nModified < 1 ) throw new Error ("Requete de modification échouée");
        res.redirect('/auteurs');

    })
    .catch(err => {
        console.log(err);
        res.redirect('/auteurs');
    })

} 

