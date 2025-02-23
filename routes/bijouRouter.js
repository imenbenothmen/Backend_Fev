var express = require('express');
var router = express.Router();
const bijouController = require('../controllers/bijouController');
/* GET home page. */
router.get('/getAllbijoux', bijouController.getAllbijoux );
router.get('/getbijouById/:id', bijouController.getbijouById );





router.post('/addbijou', bijouController.addbijou);


router.put('/updatebijou/:id', bijouController.updatebijou );
router.put('/vendre', bijouController.vendre );
router.put('/removeBijouFromUser', bijouController.removeBijouFromUser);



router.delete('/deletebijouById/:id', bijouController.deletebijouById );

module.exports = router;