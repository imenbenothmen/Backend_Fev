const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamationController');

// Soumettre une réclamation
router.post('/reclamations', reclamationController.soumettreReclamation);

// Obtenir le statut d'une réclamation
router.get('/reclamations/:reclamationId/statut', reclamationController.getStatutReclamation);

// Mettre à jour le statut d'une réclamation
router.put('/reclamations/:reclamationId/statut', reclamationController.mettreAJourStatut);

// Obtenir les détails d'une réclamation
router.get('/reclamations/:reclamationId/details', reclamationController.getDetailsReclamation);

// Résoudre une réclamation
router.put('/reclamations/:reclamationId/resoudre', reclamationController.resoudreReclamation);

// Archiver une réclamation
router.put('/reclamations/:reclamationId/archiver', reclamationController.archiverReclamation);

// Supprimer une réclamation
router.delete('/reclamations/:reclamationId', reclamationController.supprimerReclamation);

module.exports = router;






