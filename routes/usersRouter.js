var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const {requireAuthUser} = require('../middlewares/authMiddleware');
/* GET users listing. */
router.get('/getAllUsers',userController.getAllUsers); 
router.get('/getUserById/:id',userController.getUserById);
router.get('/searchUserByUsername',userController.searchUserByUsername); 
router.get('/getAllUsersSortByAge',userController.getAllUsersSortByAge); 
router.get('/getAllUsersAge/:age',userController.getAllUsersAge); 
router.get('/getAllUsersAgeBetMaxAgeMinAge',userController.getAllUsersAgeBetMaxAgeMinAge); 
router.get('/getAllClient',userController.getAllClient); 
router.get('/getAllAdmin',userController.getAllAdmin); 

router.post('/addUserLivreur',userController.addUserLivreur);
router.post('/addUserClient',userController.addUserClient);
router.post('/addUserAdmin',userController.addUserAdmin); 
router.post('/addUserClientWithImg',upload.single("image_user"),userController.addUserClientWithImg); 
router.post('/login',userController.login); 
router.post('/logout',userController.logout); 


router.put('/updateUserById/:id',userController.updateUserById); 

router.delete('/deleteUserById/:id',userController.deleteUserById);



module.exports = router;
