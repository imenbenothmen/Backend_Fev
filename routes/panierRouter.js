
const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panierController');

// Créer un nouveau panier
router.post('/create', panierController.createPanier);

// Récupérer le panier d'un utilisateur par ID
router.get('/:clientId', panierController.getPanierByClient);

// Ajouter un produit au panier
router.post('/addProduit', panierController.addProduitToPanier);

// Supprimer un produit du panier
router.delete('/removeProduit/:clientId/:produitId', panierController.removeProduitFromPanier);

// Mettre à jour la quantité d'un produit dans le panier
router.put('/updateQuantite', panierController.updateQuantiteProduit);

// Supprimer le panier d'un client
router.delete('/deletePanier/:clientId', panierController.deletePanier);

// Valider la commande et vider le panier
router.post('/validerCommande', panierController.validerCommande);

// Afficher le panier d'un client
router.get('/afficherPanier/:clientId', panierController.afficherPanier);
//Créer ou Mettre à Jour un Panier (Persisté)
router.post('/api/panier/:userId', panierController.creerOuMettreAJourPanier);
//Récupérer le Panier d'un Utilisateur
router.get('/api/panier/:userId', panierController.getPanierUtilisateur);
//Ajouter un Produit au Panier avec Vérification du Stock
router.post('/api/panier/ajouter', panierController.ajouterProduitAuPanier);
//Vérifier le Stock Disponible en Temps Réel pour le Panier
router.post('/api/panier/verifier-stock', panierController.verifierStockPanier);
//Mettre à Jour le Panier en Cas de Modification de Stock
router.put('/api/panier/:userId/mettre-a-jour-stock', panierController.mettreAJourStockPanier);





module.exports = router;
