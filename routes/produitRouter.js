const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

// Route pour ajouter un produit
router.post('/ajouter', produitController.ajouterProduit);

// Route pour supprimer un produit par ID
router.delete('/supprimer/:id', produitController.supprimerProduit);

// Route pour afficher tous les produits
router.get('/afficher', produitController.afficherProduits);

// Route pour afficher les détails d'un produit par ID
router.get('/details/:id', produitController.afficherDetailsProduit);

// Route pour obtenir le nombre de produits dans une catégorie
router.get('/nombre/:categorieId', produitController.getNombreProduits);

// Route pour obtenir le nom d'un produit par ID
router.get('/nom/:id', produitController.getNomProduit);

// Route pour mettre à jour un produit par ID
router.put('/mettre-a-jour/:id', produitController.mettreAJourProduit);

module.exports = router;
