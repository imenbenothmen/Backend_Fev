var express = require('express');
var router = express.Router();
const osController = require('../controllers/osController');
/* GET home page. */
router.get('/getOsInformation', osController.getOSInformation );
module.exports = router;