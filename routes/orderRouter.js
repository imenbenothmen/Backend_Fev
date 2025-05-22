const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

// Route pour récupérer toutes les commandes
router.get('/', orderController.getAllOrders);

router.post('/addOrder', orderController.addOrder);
// Create an order from a user's cart
router.post('/order', orderController.createOrder);

// Get all orders for a specific client
router.get('/orders/:clientId', orderController.getOrdersByClient);

// Update the status of an order
router.put('/', orderController.updateOrderStatus);

// Cancel an order
router.put('/order/:orderId/cancel', orderController.cancelOrder);

// Get details of a specific order
router.get('/order/:orderId', orderController.getOrderDetails);

// Track the status of an order
router.get('/order/:orderId/track', orderController.trackOrder);

// Notify user when order status changes (email/SMS)
router.post('/order/:orderId/notify', orderController.notifyStatusChange);

// Modify an order before it is shipped
router.put('/order/:orderId/edit', orderController.modifyOrderBeforeShipment);

// Get order history for a specific user
router.get('/orders/history/:userId', orderController.getOrderHistory);

// Get full details of a specific order
router.get('/orders/details/:orderId', orderController.getOrderDetailsById);

module.exports = router;
