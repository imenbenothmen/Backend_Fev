const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Add a product to favorites
router.post('/add', favoritesController.add_to_favorites);

// Remove a product from favorites
router.post('/remove', favoritesController.remove_from_favorites);

// Show all favorite products
router.get('/:clientId/show', favoritesController.show_favorites);

// Check if a product is in favorites
router.post('/check', favoritesController.check_if_favorite);

// Clear favorites
router.post('/clear', favoritesController.clear_favorites);

// Number of products in favorites
router.get('/:clientId/count', favoritesController.count_favorites);

module.exports = router;
