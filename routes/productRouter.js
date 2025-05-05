const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadFile');

// Route to add a product with an image
router.post('/addProduct', upload.single('image'), productController.addProduct);


// Route to delete a product by ID
router.delete('/deleteProduct/:id', productController.deleteProduct);

// Route to get all products
router.get('/getAllProducts', productController.getAllProducts);

// Route to get product details by ID
router.get('/getProductDetails/:id', productController.getProductDetails);

// Route to get the number of products in a category
router.get('/getProductCountByCategory/:categoryId', productController.getProductCountByCategory);

// Route to get the name of a product by ID
router.get('/getProductName/:id', productController.getProductName);

// Route to update a product by ID
router.put('/updateProduct/:id', productController.updateProduct);

module.exports = router;
