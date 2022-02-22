const livreSchema = require("../models/livres.modele"); // récupération du modèle Livre
const auteurSchema = require("../models/auteurs.modele"); 
const mongoose = require("mongoose");
const fs = require("fs");

exports.livres_affichage = (requete, reponse) => {
    auteurSchema.find()  // * on recupère la liste des auteurs
    .exec()
    .then(auteurs => {     
        livreSchema.find() // * puis on récupère la liste des auteurs
        .populate("auteur") // * Permet d'avoir accès a toute les informations de l'objet auteur et accéder a toute ses propriétés
        .exec()
        .then(livres => {   
            console.log(auteurs); 
            reponse.render("livres/list.html.twig", {
                liste: livres,
                auteurs: auteurs,
                message: reponse.locals.message
            })
        })
        .catch(error => {
            console.log(error);
        })
    })
    .catch(error => {
        console.log(error);
    })
}  

exports.livres_ajout = (req, res) => { 
    const livre = new livreSchema({
        _id: new mongoose.Types.ObjectId(),
        nom: req.body.titre,
        auteur: req.body.auteur,
        pages: req.body.pages,
        description: req.body.description,
        image: req.file.path.substring(14) 
    });
    livre.save()
        .then(resultat => {
            console.log(resultat);
            res.redirect('/livres');
            console.log(req.file.url);
        })
        .catch(error => {
            console.log(error);
        })

}

exports.livre_affichage = (requete, reponse) => {

    
    livreSchema.findById(requete.params.id) // * fonction find mais avec l'ID, en le récupérant avec params
        .populate("auteur")  //* Simple ajout de populate ici pour récupérer la collection
        .exec()
        .then(livre => {
            reponse.render("livres/livre.html.twig", {
                livre: livre,
                isModified: false 
            });
        })
        .catch(error => {
            console.log(error);
        })

}

exports.livre_routeModification = (req, res) => {
    auteurSchema.find()
    .exec()
    .then((auteurs) => {
        livreSchema.findById(req.params.id) // * fonction find mais avec l'ID, en le récupérant avec params
        .populate('auteur')
        .exec()
        .then(livre => {
            res.render("livres/livre.html.twig", {
                livre: livre,
                auteurs: auteurs,
                isModified: true
            });
        })
        .catch(error => {
            console.log(error);
        })
    })
  .catch(error => {
      console.log(error);
    })
}

exports.livre_modification = (req, res) => {
    console.log(req.body);
    const livreUpdate = {
        nom: req.body.titre,
        auteur: req.body.auteur,
        pages: req.body.pages,
        description: req.body.description
    }
    livreSchema.updateOne({
            _id: req.body.identifiant
        }, livreUpdate)
        .exec()
        .then(result => {
            if (result.modifiedCount < 1) throw new Error("Erreur de Modification");
            req.session.message = {
                type: 'success',
                contenu: 'modification effectuée'
            }
            res.redirect("/livres");
        })
        .catch(error => {
            console.error(error);
            req.session.message = {
                type: 'danger',
                contenu: error.message
            }
            res.redirect("/livres");
        })
}

exports.livre_suppression = (requete, reponse) => {
    var livre = livreSchema.findById(requete.params.id)
    .select('image')
    .exec()
    .then(livre => {                                            
        fs.unlink("./public/images/"+livre.image, error => { //* selection et suppresion du fichier PUIS du livre ( asynchrone )
            console.log(error);                              //* Sinon, le livre est bien supprimer MAIS l'image restait en BDD
        })
         livreSchema.remove({
            _id: requete.params.id
        })
        .exec()
        .then(resultat => {                                  //* Suppression du livre
            requete.session.message = {
                type: 'success',
                contenu: 'Suppression effectuée'
            }
            reponse.redirect("/livres");
        })
        .catch(error => {
            console.log(error);
        })
    })
}

exports.livre_modification_image = (req, res) => {
    var livre = livreSchema.findById(req.body.identifiant)
    .select('image')
    .exec()
    .then(livre => {
        fs.unlink("./public/images/"+livre.image, error => { //* selection et suppresion du fichier PUIS du livre ( asynchrone )
            console.log(error);                              //* Sinon, le livre est bien supprimer MAIS l'image restait en BDD
        })
            const livreUpdate = {
            image:req.file.path.substring(14)
        }
        livreSchema.update({_id:req.body.identifiant}, livreUpdate)
        .exec()
        .then(result => {
            res.redirect("/livres/modification/"+req.body.identifiant)
        })
        .catch(error => {
            console.log(error);
        })
     });
}