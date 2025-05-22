var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { requireAuthUser, requireAdmin } = require('../middlewares/authMiddleware');

router.post('/create-first-admin', userController.createFirstAdmin);







router.get('/getAllUsers', requireAuthUser, requireAdmin, userController.getAllUsers);

router.get('/getUserById/:id', userController.getUserById);
router.get('/searchUserByUsername', userController.searchUserByUsername);
router.get('/getAllClient', requireAuthUser, requireAdmin, userController.getAllClient);
router.get('/getAllAdmin', requireAuthUser, requireAdmin, userController.getAllAdmin);


router.post('/addUserLivreur', userController.addUserLivreur);
router.post('/addUserClient', userController.addUserClient);
router.post('/addUserClientWithImg', upload.single("image_user"), userController.addUserClientWithImg); 

router.post('/login', userController.login); 
router.post('/logout', userController.logout); 

/* Routes sécurisées, accès utilisateur connecté (client ou admin) */
router.get('/profile', requireAuthUser, userController.getMyProfile);
router.put('/profile/update', requireAuthUser, userController.updateMyProfile);
router.put('/updateUserById/:id', requireAuthUser, userController.updateUserById);
router.delete('/deleteUserById/:id', requireAuthUser, userController.deleteUserById);

/* Routes réservées aux admins */
router.post('/addUserAdmin', requireAuthUser, requireAdmin, userController.addUserAdmin);


router.get('/admin-only', requireAuthUser, requireAdmin, (req, res) => {
  res.json({ message: `Bienvenue admin ${req.session.user.username}` });
});
module.exports = router;

