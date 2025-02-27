var express = require('express');
var router = express.Router();
const categorieController = require('../controllers/categorieController');

/* GET home page. */
router.post('/ajouter', categorieController.ajouterCategorie);
router.delete('/supprimer/:id', categorieController.supprimerCategorie);
router.get('/liste', categorieController.getCategories);
router.get('/details/:id', categorieController.getCategorieDetails);
router.put('/renommer/:id', categorieController.renommerCategorie);

module.exports = router;

