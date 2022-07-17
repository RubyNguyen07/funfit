var RecRoutine = require('../models/Routine'); 
var MyRoutine = require('../models/MyRoutine'); 
var User = require('../models/User');
var CalendarList = require('../models/CalendarList');
var mongoose = require('mongoose');
var findPos = require('../utils/arrayUtil');

// Fetch user's own routines 
exports.getMyRoutines = async (req, res) => {
    try {
        const { id } = req.user; 
        const routines = await MyRoutine.find({userId: id}); 
        res.status(200).json(routines); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Fetch a routine in user's library 
exports.getMyRoutine = async (req, res) => {
    try {
        const { id } = req.query; 
        const routine = await MyRoutine.findById(id); 
        res.status(200).json(routine); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Fetch a recommended routine 
exports.getRecRoutine = async (req, res) => {
    try {
        const { id } = req.query; 
        const routine = await RecRoutine.findById(id); 
        res.status(200).json(routine); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Fetch recommended routines based on genre
exports.getRoutinesByGenre = async (req, res) => {
    try {
        const { genre } = req.query; 
        const routines = await RecRoutine.find({ genre: genre }); 
        res.status(200).json(routines); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Create a new routine 
exports.createNewRoutine = async (req, res) => {
    try {
        if (req.body.steps.length == 0 || (req.body.steps.length !== req.body.timings.length)) {
            return res.status(400).send({ message: "Invalid steps or timings" }); 
        }

        const hasExisted = await MyRoutine.find({userId: req.user.id, name: req.body.name})

        if (hasExisted.length > 0) {
            return res.status(400).send({ message: "Please choose a different name" }); 
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
        res.status(201).send({id: newRoutine._id}); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Add a recommended routine to user's own library 
exports.addToMyLibrary = async (req, res) => {
    try {
        const recRoutineId = req.body.id; 
        const recRoutine = await RecRoutine.findById(recRoutineId); 
        
        const hasExisted = await MyRoutine.find({ userId: req.user.id, youtubeVideo: recRoutine.youtubeVideo });
        if (hasExisted.length > 0) {
            return res.status(400).send({ message: "Rec routine has already been added to your library" }); 
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
        res.status(201).send({ message: "Added to library" }); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Delete a routine 
exports.deleteRoutine = async (req, res) => {
    try {
        const { id } = req.body; 
        const hasDeleted = await MyRoutine.findByIdAndDelete(id); 
        if (hasDeleted) {
            return res.status(204).end();
        }
        res.status(400).send({ message: "Routine does not exist" });
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Edit a routine 
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
        res.status(200).send({ message: "Update successfully" }); 

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

/** Helper function to increase points and level of a given user 
 * @param { User } user: given user 
 * @param { number } levelPoints: points need to be added  
 */
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

// Add a day to DaysFollow after completing a routine 
exports.addRoutineDay = async (req, res) => {
    try {
        const { id } = req.body; 
        const user = await User.findById(req.user.id); 

        const routine = await MyRoutine.findById(id); 
        if (routine == null) {
            return res.status(400).send("Routine does not exist"); 
        }
        const name = "C: " + routine.name; 

        const currDate = new Date().toLocaleDateString('en-CA'); 
    
        const item = await CalendarList.findOne({ userId: req.user.id });
        // If there is no CalendarList created to this user yet, create one with the given date and routine 
        if (!item) {
            addPointsHelper(user, 1000);
            await new CalendarList({
                userId: req.user.id, 
                calendarList: new Map([[currDate, [name]]])
            }).save();
            await user.save();  
            return res.status(200).send("Date added and points added"); 
        }

        const calendarList = item.calendarList; 
        // If a date already exists in daysFollow, then have to fetch the 
        // array of the date and push new date to it 
        if (calendarList.has(currDate)) {
            var oldCalendarList = calendarList.get(currDate); 
            findPos(oldCalendarList, name, oldCalendarList.length, true)
            calendarList.set(currDate, oldCalendarList);
        } else {
            // Else, set a new date as key 
            calendarList.set(currDate, [name]); 
        }

        // Add points according to user's level 
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

        const sess = await mongoose.startSession(); 
        await sess.withTransaction( async () => {
            await CalendarList.updateOne(
                {
                    userId: req.user.id, 
                }, 
                {
                    $set: {
                        calendarList: calendarList
                    }
                }, 
                {
                    new: true,
                    session: sess

                }
            ); 
            
            await user.save({ session: sess });
        })
  
        return res.status(200).send("Date added and Points added"); 

    } catch (err) {
        return res.status(500).send(err.message)
    }

}

// Add reminder to a routine 
exports.addReminder = async (req, res) => {
    try {
        const reminderMessage = req.body.reminderMessage; 
        if (reminderMessage == "") {
            return res.status(400).send("Null reminder message");
        } 

        const formattedDate = new Date(req.body.date);
        if (formattedDate == "Invalid Date") {
            return res.status(400).send("Invalid date type");
        }
        if (formattedDate < new Date(Date.now())) {
            return res.status(400).send("Cannot set reminder in the past");
        }

        const date = formattedDate.toLocaleDateString('en-CA'); 
        var min = formattedDate.getMinutes();
        var finalMin = min < 10 
            ? 0 + "" + min
            : min;
        var hour = formattedDate.getHours(); 
        var finalHour = hour < 10 
            ? 0 + "" + hour
            : hour; 
        const formattedMessage = "R: " + finalHour + ":" + finalMin + " - " + reminderMessage;

        const item = await CalendarList.findOne({ userId: req.user.id });
        // If there is no ReminderList created to this user yet, create one with the given date and routine 
        if (!item) {
            await new CalendarList({
                userId: req.user.id, 
                calendarList: new Map([[date, [formattedMessage]]])
            }).save(); 
            return res.status(200).send("Reminder added"); 
        }

        var calendarList = item.calendarList; 
        if (calendarList.has(date)) {
            // If a date already exists in reminderList, then have to fetch the 
            // array of the date and push new date to it 
            var currDateList = calendarList.get(date); 
            // currDateList.push(formattedMessage); 
            findPos(currDateList, formattedMessage, currDateList.length, false);
        } else {
            // Else, set a new date as key
            calendarList.set(date, [formattedMessage]);
        }

        await CalendarList.updateOne(
            {
                userId: req.user.id
            },
            {
                $set: {
                    calendarList: calendarList
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