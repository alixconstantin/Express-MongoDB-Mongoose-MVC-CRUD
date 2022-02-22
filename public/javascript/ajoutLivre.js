function afficherFormulaire() {
    document.querySelector("#ajoutForm").removeAttribute("class");
    // supprime la classe d-none sur l'ajout

    document.querySelector("#modifLivre").className="d-none";
    // le rajoute sur le modif " -d none" pour éviter doublons
}