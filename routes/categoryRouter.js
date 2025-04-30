var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');

// Routes for category management
router.post('/addCategory', categoryController.addCategory);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);
router.get('/getCategories', categoryController.getCategories);
router.get('/getCategoryDetails/:id', categoryController.getCategoryDetails);
router.put('/renameCategory/:id', categoryController.renameCategory);

module.exports = router;
