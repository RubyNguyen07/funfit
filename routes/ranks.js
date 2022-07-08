var express = require("express"); 
var router = express.Router(); 

var rankController = require('../controllers/rankController');

router.get('/level', rankController.getLevel);

module.exports = router; 