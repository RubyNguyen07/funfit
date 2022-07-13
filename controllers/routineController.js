var RecRoutine = require('../models/Routine'); 
var MyRoutine = require('../models/MyRoutine'); 
var User = require('../models/User');
var ReminderList = require('../models/ReminderList');
var mongoose = require('mongoose');

exports.getMyRoutines = async (req, res) => {
    try {
        const { id } = req.user; 
        const routines = await MyRoutine.find({userId: id}); 
        res.status(200).json(routines); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.getMyRoutine = async (req, res) => {
    try {
        const { id } = req.query; 
        const routine = await MyRoutine.findById(id); 
        res.status(200).json(routine); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.getRecRoutine = async (req, res) => {
    try {
        const { id } = req.query; 
        const routine = await RecRoutine.findById(id); 
        res.status(200).json(routine); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.getRoutinesByGenre = async (req, res) => {
    try {
        const { genre } = req.query; 
        const routines = await RecRoutine.find({ genre: genre }); 
        res.status(200).json(routines); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.createNewRoutine = async (req, res) => {
    try {
        if (req.body.steps !== null && (req.body.steps.length !== req.body.timings.length)) {
            return res.status(400).send("Number of steps is not equal to that of timings"); 
        }

        const hasExisted = await MyRoutine.find({userId: req.user.id, name: req.body.name})

        if (hasExisted.length > 0) {
            return res.status(400).send("Please choose a different name"); 
        }
        
        const newRoutine = new MyRoutine ({
            name: req.body.name, 
            duration: req.body.duration,
            steps: req.body.steps,
            timings: req.body.timings,   
            genre: req.body.genre, 
            userId: req.user.id, 
            reminder: req.body.reminder, 
            youtubeVideo: req.body.youtubeVideo, 
            difficulty: req.body.difficulty, 
            description: req.body.description
        })

        await newRoutine.save(); 
        //Later change to save successfully 
        res.status(201).send("New routine created"); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.addToMyLibrary = async (req, res) => {
    try {
        const recRoutineId = req.body.id; 
        const recRoutine = await RecRoutine.findById(recRoutineId); 
        
        const hasExisted = await MyRoutine.find({ userId: req.user.id, youtubeVideo: recRoutine.youtubeVideo });
        if (hasExisted.length > 0) {
            return res.status(400).send("Rec routine has already been added to your library"); 
        }

        const newRoutine = new MyRoutine({
            name: "RecRoutine: " + recRoutine.name, 
            duration: recRoutine.duration,
            genre: recRoutine.genre, 
            userId: req.user.id, 
            reminder: recRoutine.reminder, 
            youtubeVideo: recRoutine.youtubeVideo, 
            difficulty: recRoutine.difficulty, 
            description: recRoutine.description, 
            thumbnail: recRoutine.thumbnail
        })

        await newRoutine.save(); 
        //Later change to save successfully 
        res.status(201).send("Added to library"); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.deleteRoutine = async (req, res) => {
    try {
        const { id } = req.body; 
        await MyRoutine.findByIdAndDelete(id); 
        res.status(204).send("Routine deleted from my library");
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.editRoutine = async (req, res) => {
    try {
        const { id } = req.body; 
        const updatedFields = {
            name: req.body.name, 
            duration: req.body.duration,
            steps: req.body.steps,
            timings: req.body.timings,   
            genre: req.body.genre, 
            reminder: req.body.reminder,
            youtubeVideo: req.body.youtubeVideo, 
            difficulty: req.body.difficulty, 
            description: req.body.description
        }; 

        await MyRoutine.findByIdAndUpdate(id, updatedFields); 
        res.status(200).send("Update successfully"); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// // Should download it to user's phone or else it might be too much to get the audio aroung all the time 
// exports.generateAudioFiles = async (req, res) => {
//     try {
//         const { id } = req.body; 
//         const routine = await MyRoutine.findById(id); 

//         if (routine == null) {
//             return res.status(400).send("Routine does not exist"); 
//         }

//         if (routine.audioGenerated) {
//             return res.status(400).send("Audio already generated"); 
//         }

//         const { steps } = routine; 
//         const fileName = id + ".mp3"; 
//         for (let i = 0; i < steps.length; i++) {
//             var gtts = new GTTS(steps[i], 'en'); 
//             gtts.save(i + "-" + fileName, (err, result) => {
//                 if (err) {
//                     return res.send(err.message); 
//                 }
//             })
//         }
        
//         await MyRoutine.findByIdAndUpdate(id, {audioGenerated: true}); 
//         return res.status(200).send("Routine audio created");

//     } catch (err) {
//         return res.status(500).send(err.message); 
//     }
// }

var addPointsHelper = (user, levelPoints) => {
    var originalPoints = user.points; 
    user.points = (user.points + 100) % levelPoints; 
    user.level = originalPoints >= user.points 
                    ? ( user.level === 20 
                        ? ( user.points = 10000 )
                        : ++user.level 
                      )
                    : user.level; 
}


// Test this later when have more information about date added 
exports.addRoutineDay = async (req, res) => {
    try {
        const { id } = req.body; 
        const user = await User.findById(req.user.id); 
        var daysFollow = user.daysFollow;

        const routine = await MyRoutine.findById(id); 
        if (routine == null) {
            return res.status(400).send("Routine does not exist"); 
        }
    
        const currDate = new Date().toLocaleDateString('en-CA'); 

        var fooArr = [routine.name]; 
        if (!daysFollow) {
            daysFollow = new Map([[currDate, fooArr]])
        } else if (daysFollow.has(currDate)) {
            var oldDaysFollow = daysFollow.get(currDate); 
            oldDaysFollow.push(routine.name); 
            daysFollow.set(currDate, oldDaysFollow);

            await User.updateOne(
                {
                    _id: req.user.id, 
                }, 
                {
                    $set: {
                        daysFollow: daysFollow
                    }
                }, 
                {
                    new: true
                }
            ); 
    
        } else {
            daysFollow.set(currDate, [routine.name]); 
        }

        if (user.level > 0 && user.level <= 5) {
            addPointsHelper(user, 1000);
        } else if (user.level >= 6 && user.level <= 8){
            addPointsHelper(user, 1500);
        } else if (user.level >= 9 && user.level <= 12) {
            addPointsHelper(user, 2000);
        } else if (user.level >=13 && user.level <=  15) {
            addPointsHelper(user, 3000);
        } else if (user.level >=16 && user.level <= 17) {
            addPointsHelper(user, 5000);
        } else if (user.level <= 18 && user.level >= 19) {
            addPointsHelper(user, 8000);
        }  else {
            addPointsHelper(user, 10000);
        }

        await user.save(); 
        return res.status(200).send("Date added and Points added"); 
    } catch (err) {
        return res.status(500).send(err.message)
    }

}

// exports.getFollow


exports.addReminder = async (req, res) => {
    try {
        const reminderMessage = req.body.reminderMessage; 
        if (reminderMessage == "" ) {
            return res.status(400).send("Null reminder message");
        } 

        const formattedDate = new Date(req.body.date);
        if (formattedDate == "Invalid Date") {
            return res.status(400).send("Invalid date type");
        }
        const date = formattedDate.toLocaleDateString('en-CA'); 
        const formattedMessage = formattedDate.getHours() + ":" + formattedDate.getMinutes() + " - " + reminderMessage;

        const item = await ReminderList.findOne({ userId: req.user.id });
        if (!item) {
            await new ReminderList({
                userId: req.user.id, 
                reminderList: new Map([[date, [formattedMessage]]])
            }).save(); 
            return res.status(200).send("Reminder added"); 
        }

        var reminderList = item.reminderList; 
        if (reminderList.has(date)) {
            var currDateList = reminderList.get(date); 
            currDateList.push(formattedMessage); 
        } else {
            reminderList.set(date, [formattedMessage]);
        }

        await ReminderList.updateOne(
            {
                userId: req.user.id
            },
            {
                $set: {
                    reminderList: reminderList
                }
            }, 
            {
                new: true
            }
        )

        return res.status(200).send("Reminder added"); 

    } catch (err) {
        res.status(500).send(err.message);
    }
}