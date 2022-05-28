var express = require("express"); 
var router = express.Router(); 
var userController = require('../controllers/userController'); 
var checkUniqueMiddleware = require('../middlewares/checkUniqueEmail'); 
var authMiddleware = require('../middlewares/auth'); 

// Sign up 
router.post('/signup', checkUniqueMiddleware.checkUniqueEmail, userController.signup); 

// Log in 
router.post('/login', userController.login); 

// Log out 
router.get('/logout', userController.logout); 

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

module.exports = router; 