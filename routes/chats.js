var express = require("express"); 
var router = express.Router(); 

var chatController = require('../controllers/chatController');
var middleware = require('../middlewares/auth');

//Authorization 
router.use(middleware.auth); 

// Initiate chat 
router.post('/initiateConvo', chatController.initiateChat); 

// Get all conversations 
router.get('/getAllConvos', chatController.getAllConversations);

// Get a conversation by id 
router.get('/getAConvo', chatController.getConversationById);

// Delete a conversation 
router.delete('/deleteConvo', chatController.deleteConvo); 


module.exports = router; 