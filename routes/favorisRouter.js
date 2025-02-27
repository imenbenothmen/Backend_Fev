const express = require('express');
const router = express.Router();
const favorisController = require('../controllers/favorisController');

// Ajouter un produit aux favoris
router.post('/ajouter', favorisController.ajouter_au_favoris);

// Retirer un produit des favoris
router.post('/retirer', favorisController.retirer_du_favoris);

// Afficher tous les produits favoris
router.get('/:clientId/afficher', favorisController.afficher_favoris);

// Vérifier si un produit est dans les favoris
router.post('/verifier', favorisController.verifier_si_favori);

// Vider les favoris
router.post('/vider', favorisController.vider_favoris);

// Nombre de produits dans les favoris
router.get('/:clientId/nombre', favorisController.nombre_favoris);

module.exports = router;
