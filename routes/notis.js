var express = require("express"); 
var router = express.Router(); 

var notiController = require('../controllers/notiController');  
var middleware = require('../middlewares/auth'); 

//Authorization 
router.use(middleware.auth);

// Get all notis
router.get('/getAllNotis', notiController.getAllNotis); 

// Get a noti 
router.get('/getNoti', notiController.getNoti);

// Send a noti 
router.post('/sendANoti', notiController.sendANoti);

// Delete a noti 
router.delete('/deleteNoti', notiController.deleteNoti);