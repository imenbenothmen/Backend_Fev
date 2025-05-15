const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
// GET – Récupérer toutes les réclamations
router.get('/', complaintController.getAllComplaints);

// Submit a complaint
router.post('/complaints', complaintController.submitComplaint);

// Get the status of a complaint
router.get('/complaints/:complaintId/status', complaintController.getComplaintStatus);

// Update the status of a complaint
router.put('/complaints/:complaintId/status', complaintController.updateComplaintStatus);

// Get the details of a complaint
router.get('/complaints/:complaintId/details', complaintController.getComplaintDetails);

// Resolve a complaint
router.put('/complaints/:complaintId/resolve', complaintController.resolveComplaint);

// Archive a complaint
router.put('/complaints/:complaintId/archive', complaintController.archiveComplaint);

// Delete a complaint
router.delete('/complaints/:complaintId', complaintController.deleteComplaint);

module.exports = router;




