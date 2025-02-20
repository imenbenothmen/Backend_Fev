var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
/* GET users listing. */
router.post('/addUserClient',userController.addUserClient);
router.post('/addUserAdmin',userController.addUserAdmin); 
router.get('/getAllUsers',userController.getAllUsers); 
router.get('/getUserById/:id',userController.getUserById);
router.get('/deleteUserById',userController.deleteUserById);
router.put('/updateuserById/:id',userController.updateuserById); 
router.get('/searchUserByUsername',userController.searchUserByUsername); 
router.get('/getAllUsersSortByAge',userController.getAllUsersSortByAge); 
router.get('/getAllUsersAge/:age',userController.getAllUsersAge); 
router.get('/getAllUsersAgeBetMaxAgeMinAge',userController.getAllUsersAgeBetMaxAgeMinAge); 
router.get('/getAllClient',userController.getAllClient); 
router.get('/getAllAdmin',userController.getAllAdmin); 


router.post('/addUserClientWithImg',upload.single("image_user"),userController.addUserClientWithImg); 

module.exports = router;
