var express = require("express"); 
var router = express.Router(); 
var friendsRecController = require('../controllers/friendsRecController');
var storyController = require('../controllers/storyController');
var authMiddleware = require('../middlewares/auth'); 

// Authenticate the following part
router.use(authMiddleware.auth);

// Recommend friends to see stories 
router.get('/recommendedFriends', friendsRecController.getRecommendedFriends);

// Retrieve list of stories 
router.get('/getStoriesInfo/:userId', storyController.getStoriesInfo);

// Download a story 
router.get('/getStory', storyController.downloadStory); 

//  Upload a story 
router.post('/uploadStory', storyController.uploadFile);

// Delete a story 
router.delete('/deleteStory', storyController.deleteStory);

module.exports = router; 