const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuthUser } = require('../middlewares/authMiddleware');

// Ajouter un avis - accessible uniquement aux utilisateurs connectés
router.post('/addReview', requireAuthUser, reviewController.addReview);

// Obtenir les avis d'un produit - accessible à tous
router.get('/getReviews/:productId', reviewController.getReviewsByProduct);

module.exports = router;
