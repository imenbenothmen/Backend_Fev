var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const {requireAuthUser} = require('../middlewares/authMiddleware');
/* GET users listing. */
router.get('/getAllUsers',userController.getAllUsers); 
router.get('/getUserById/:id',userController.getUserById);
router.get('/searchUserByUsername',userController.searchUserByUsername); 



router.get('/getAllClient',userController.getAllClient); 
router.get('/getAllAdmin',userController.getAllAdmin); 
// Nouveau endpoint sécurisé pour consulter son propre profil
router.get('/profile', requireAuthUser, userController.getMyProfile);

router.post('/addUserLivreur',userController.addUserLivreur);
router.post('/addUserClient',userController.addUserClient);
router.post('/addUserAdmin',userController.addUserAdmin); 
router.post('/addUserClientWithImg',upload.single("image_user"),userController.addUserClientWithImg); 
router.post('/login',userController.login); 
router.post('/logout',userController.logout); 


router.put('/updateUserById/:id',userController.updateUserById); 

// Nouveau endpoint sécurisé pour mettre à jour son profil
router.put('/profile/update', requireAuthUser, userController.updateMyProfile);

router.delete('/deleteUserById/:id',userController.deleteUserById);




module.exports = router;
