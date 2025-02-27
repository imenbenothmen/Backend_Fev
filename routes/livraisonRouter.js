const express = require('express');
const router = express.Router();
const livraisonController = require('../controllers/livraisonController');

// Créer une livraison
router.post('/livraisons', livraisonController.createLivraison);

// Obtenir toutes les livraisons d'un client
router.get('/livraisons/client/:clientId', livraisonController.getLivraisonsByClient);

// Obtenir une livraison par ID
router.get('/livraisons/:livraisonId', livraisonController.getLivraisonById);

// Mettre à jour le statut d'une livraison
router.put('/livraisons/:livraisonId', livraisonController.mettreAJourStatut);

// Supprimer une livraison
router.delete('/livraisons/:livraisonId', livraisonController.deleteLivraison);

// Calculer les frais de livraison
router.get('/livraisons/frais/:destination/:poids', (req, res) => {
  const { destination, poids } = req.params;
  const frais = livraisonController.calculerFraisLivraison(destination, parseFloat(poids));
  res.status(200).json({ frais });
});

// Obtenir l'adresse de livraison
router.get('/livraisons/adresse/:livraisonId', livraisonController.getAdresseLivraison);

// Obtenir la date de livraison
router.get('/livraisons/date/:livraisonId', livraisonController.getDateLivraison);

// Suivre une livraison avec un numéro de suivi
router.get('/livraisons/suivi/:numeroSuivi', livraisonController.suivreLivraison);

// Annuler une livraison
router.put('/livraisons/annuler/:livraisonId', livraisonController.annulerLivraison);

// Confirmer une livraison
router.put('/livraisons/confirmer/:livraisonId', livraisonController.confirmerLivraison);


// Routes pour le choix de transporteurs
router.get('/transporteurs', livraisonController.listerTransporteurs);
router.post('/commandes/:commandeId/transporteur', livraisonController.choisirTransporteur);

// Route pour calculer les frais de livraison
router.post('/calculer-frais-livraison', livraisonController.calculerFraisLivraison);

module.exports = router;
