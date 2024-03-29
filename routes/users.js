var express = require("express"); 
var router = express.Router(); 
var userController = require('../controllers/userController'); 
var checkUniqueMiddleware = require('../middlewares/checkUniqueEmail'); 
var authMiddleware = require('../middlewares/auth'); 
var uploadController = require('../controllers/uploadController');

// Sign up 
router.post('/signup', checkUniqueMiddleware.checkUniqueEmail, userController.signup); 

// Log in 
router.post('/login', userController.login); 

// Refresh token 
router.post('/refreshToken', userController.refreshToken);

// Reset password
router.post('/resetPassword', userController.passwordReset); 

// Forgot password 
router.post('/forgotPassword', userController.forgotPassword); 

// Authenticate the following part
router.use(authMiddleware.auth)

// Get profile 
router.get('/me', userController.me); 

// Get level and  points 
router.get('/level', userController.getLevel); 

// Update profile 
router.put('/updateProfile', userController.updateProfile); 

// Upload profile picture 
router.post('/upload', uploadController.uploadFile); 

// Get information about profile pic needed to download pic 
router.get('/getPicInfo', uploadController.getProfilePic);

// Download pic 
router.get('/downloadPic', uploadController.download); 

// Retrieve information about other user's profile
router.get('/getUserProfile', userController.getUserProfile);

// // Get days complete whole routine 
// router.get('/getDaysFollow', userController.getDaysFollow);

// // Get reminder list for routines 
// router.get('/getReminderList', userController.getReminderList);

// Get reminder list for routines 
router.get('/getCalendarList', userController.getCalendarList);


module.exports = router; 