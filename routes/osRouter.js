var express = require('express');
var router = express.Router();
const osContoller = require('../controllers/osContoller');
/* GET home page. */
router.get('/getOsInformation', osContoller.getOsInformation );


module.exports = router;