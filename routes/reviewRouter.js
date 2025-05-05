const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Ajouter un avis
router.post('/addReview', reviewController.addReview);

// Obtenir les avis d'un produit
router.get('/getReviews/:productId', reviewController.getReviewsByProduct);

module.exports = router;
