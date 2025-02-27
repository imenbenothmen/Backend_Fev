const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

// Créer une commande à partir du panier d'un utilisateur
router.post('/commande', commandeController.createCommande);

// Récupérer toutes les commandes d'un client
router.get('/commandes/:clientId', commandeController.getCommandesByClient);

// Modifier le statut d'une commande
router.put('/commande/:commandeId/statut', commandeController.updateStatutCommande);

// Annuler une commande
router.put('/commande/:commandeId/annuler', commandeController.annulerCommande);

// Afficher les détails d'une commande
router.get('/commande/:commandeId', commandeController.getCommandeDetails);

//Suivi des Commandes en Temps Réel
router.get('/commande/:commandeId/suivi', commandeController.suiviCommande);

//Envoyer une notification (email/SMS) lors d'un changement de statut de commande :
router.post('/api/commande/:commandeId/notifier', commandeController.notifierChangementStatut);
//Modifier une commande avant expédition 
router.put('/api/commande/:commandeId/modifier', commandeController.modifierCommandeAvantExpedition);
//Historique des Commandes
router.get('/api/commandes/:userId', commandeController.historiqueCommandes);
//Afficher les détails d'une commande spécifique
router.get('/api/commande/:commandeId', commandeController.detailsCommande);
//







module.exports = router;
