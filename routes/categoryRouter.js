var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');

// Routes for category management
router.post('/addCategory', categoryController.addCategory);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);
router.get('/getCategories', categoryController.getCategories);
router.get('/getCategoryDetails/:id', categoryController.getCategoryDetails);
router.put('/renameCategory/:id', categoryController.renameCategory);

// ✅ Ajouter ces nouvelles routes :
router.put('/updateCategory/:id', categoryController.updateCategory);
router.get('/getSubCategories/:parentId', categoryController.getSubCategoriesByParent);
router.get('/getMainCategories', categoryController.getMainCategories);
module.exports = router;
