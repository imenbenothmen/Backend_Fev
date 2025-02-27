const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');

// Laisser un avis pour un produit
router.post('/avis', avisController.laisserAvis);

// Modifier un avis pour un produit
router.put('/avis', avisController.modifierAvis);

// Supprimer un avis pour un produit
router.delete('/avis', avisController.supprimerAvis);

// Récupérer l'avis d'un utilisateur pour un produit
router.get('/avis/utilisateur', avisController.getAvisUtilisateur);

// Afficher tous les avis d'un produit
router.get('/avis/:produitId', avisController.afficherAvis);

// Calculer la note moyenne d'un produit
router.get('/avis/moyenne/:produitId', avisController.calculerNoteMoyenne);

module.exports = router;
