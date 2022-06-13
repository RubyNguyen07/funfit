var RecRoutine = require('../models/Routine'); 
var MyRoutine = require('../models/MyRoutine'); 
const GTTS = require('gtts');

exports.getMyRoutines = async (req, res) => {
    try {
        const { userId } = req.user; 
        const routines = await MyRoutine.find({userId: userId}); 
        res.status(200).json(routines); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.getMyRoutine = async (req, res) => {
    try {
        const { id } = req.body; 
        const routine = await MyRoutine.findById(id); 
        res.status(200).json(routine); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.getRecRoutine = async (req, res) => {
    try {
        const { id } = req.body; 
        const routine = await RecRoutine.findById(id); 
        res.status(200).json(routine); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.getRoutinesByGenre = async (req, res) => {
    try {
        const { genre } = req.body; 
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
        res.status(200).send(newRoutine); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.deleteRoutine = async (req, res) => {
    try {
        const { id } = req.body; 
        await MyRoutine.findByIdAndDelete(id); 
        res.status(200).send("Routine deleted from my library");
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

// Should download it to user's phone or else it might be too much to get the audio aroung all the time 
exports.generateAudioFiles = async (req, res) => {
    try {
        const { id } = req.body; 
        const routine = await MyRoutine.findById(id); 

        if (routine == null) {
            return res.status(400).send("Routine does not exist"); 
        }

        if (routine.audioGenerated) {
            return res.status(400).send("Audio already generated"); 
        }

        const { steps } = routine; 
        const fileName = id + ".mp3"; 
        for (let i = 0; i < steps.length; i++) {
            var gtts = new GTTS(steps[i], 'en'); 
            gtts.save(i + "-" + fileName, (err, result) => {
                if (err) {
                    return res.send(err.message); 
                }
            })
        }
        
        await MyRoutine.findByIdAndUpdate(id, {audioGenerated: true}); 
        return res.status(200).send("Routine audio created");

    } catch (err) {
        return res.status(500).send(err.message); 
    }
}

exports.addRoutineDay = async (req, res) => {
    try {
        const { id } = req.body; 
        const routine = await MyRoutine.findById(id); 
        if (routine == null) {
            return res.status(400).send("Routine does not exist"); 
        }
    
        const oldDaysFollow = routine.daysFollow; 
        await MyRoutine.findByIdAndUpdate(id, {daysFollow: oldDaysFollow.push(Date.now())}); 
        return res.status(200).send("Date added"); 
    } catch (err) {
        return res.status(500).send(err.message)
    }

}