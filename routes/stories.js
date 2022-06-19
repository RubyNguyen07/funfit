var express = require("express"); 
var router = express.Router(); 
var friendsRecController = require('../controllers/friendsRecController');
var authMiddleware = require('../middlewares/auth'); 

// Authenticate the following part
router.use(authMiddleware.auth);

// Recommend friends to see stories 
router.get('/recommendedFriends', friendsRecController.getRecommededFriends);

module.exports = router; 