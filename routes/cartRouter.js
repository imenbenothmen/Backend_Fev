const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Créer un nouveau panier
router.post('/createCart', cartController.createCart);

// Récupérer le panier d'un utilisateur par ID
router.get('/getCartByClient/:clientId', cartController.getCartByClient);

// Ajouter un produit au panier
router.post('/addProductToCart', cartController.addProductToCart);

// Supprimer un produit du panier
router.delete('/removeProductFromCart/:clientId/:productId', cartController.removeProductFromCart);

// Mettre à jour la quantité d'un produit dans le panier
router.put('/updateQuantityProduct', cartController.updateQuantityProduct);

// Supprimer le panier d'un client
router.delete('/deleteCart/:clientId', cartController.deleteCart);

// Valider la commande et vider le panier
router.post('/validateOrder', cartController.validateOrder);

// Afficher le panier d'un client
router.get('/showCart/:clientId', cartController.showCart);

// Créer ou mettre à jour le panier (persisté)
router.post('/createOrUpdateCart/:userId', cartController.createOrUpdateCart);

// Récupérer le panier d'un utilisateur
router.get('/getCartByUser/:userId', cartController.getCartByUser);

// Ajouter un produit au panier avec vérification du stock
router.post('/addProductToCartWithStockCheck', cartController.addProductToCartWithStockCheck);

// Vérifier la disponibilité du stock en temps réel pour le panier
router.post('/checkStockForCartProducts', cartController.checkStockForCartProducts);

// Mettre à jour le panier en cas de modification du stock
router.put('/updateCartWithStockChanges/:userId', cartController.updateCartWithStockChanges);

module.exports = router;
