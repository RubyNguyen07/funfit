var express = require("express"); 
var router = express.Router(); 

var routineController = require('../controllers/routineController');  
var recRoutineController = require('../controllers/routineRecommenderController');  
var middleware = require('../middlewares/auth'); 

//Authorization 
router.use(middleware.auth); 

//Get all my routines
router.get('/getMyRoutines', routineController.getMyRoutines); 

//Get all recommended routines 
router.get('/getRecRoutines', recRoutineController.getSimilarRoutines); 

//Get recommended routines by genre 
router.get('/getRoutinesByGenre', routineController.getRoutinesByGenre); 

//Retrieve information about a routine from my library 
router.get('/myRoutine', routineController.getMyRoutine); 

//Retrieve information about a routine from recommended lists 
router.get('/recRoutine', routineController.getRecRoutine); 

//Create a new routine or Add a recommended routine to user's library 
router.post('/newRoutine', routineController.createNewRoutine); 

// Delete a routine or unsave a recommended routine 
router.delete('/deleteRoutine', routineController.deleteRoutine); 

// Edit a routine 
router.put('/editRoutine', routineController.editRoutine); 

// //Generate audio files from a routine 
// router.get('/generateAudioFiles', routineController.generateAudioFiles); 

//Add days to routine 
router.post('/addDaysFollow', routineController.addRoutineDay); 

module.exports = router; 