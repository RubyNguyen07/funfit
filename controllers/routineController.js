var RecRoutine = require('../models/Routine'); 
var MyRoutine = require('../models/MyRoutine'); 
// const say = require('say'); 

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
        const newRoutine = new MyRoutine ({
            name: req.body.name, 
            duration: req.body.duration,
            steps: req.body.steps,
            timings: req.body.timings,   
            genre: req.body.genre, 
            userId: req.user.id, 
            reminder: req.body.reminder
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
            reminder: req.body.reminder
        }; 

        await MyRoutine.findByIdAndUpdate(id, updatedFields); 
        res.status(200).send("Update successfully"); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// exports.playRoutine = async (req, res) => {
//     try {
//         const { key, region, phrase, file } = req.body; 

//         if ( !key || !region || !phrase ) {
//             res.status(404).send("Missing information"); 
//         }

//         let fileName = null; 

//         if  (file && file) {
//             fileName =  `./temp/stream-from-file-${timeStamp()}.mp3`; 
//         }

//         const audioStream = await textToSpeech(key, region, phrase, fileName); 
//         res.set({
//             'Content-Type': 'audio/mpeg', 
//             'Transfer-Encoding': 'chunked'
//         }); 
//         audioStream.pipe(res); 
//     } catch (err) {
//         res.status(500).send(err.message); 
//     }
// }

// exports.playRoutine = async (req, res) => {
//     try {
//         const { text } = req.body; 
//         const  toReturn = say.export(text, 1, '.mp3', (err) => {
//             if (err) {
//                 return res.status(500).send(err.message); 
//             }
//         })
//         res.set({
//             'Content-Type': 'audio/mpeg'
//         }); 
//         toReturn.pipe(res);
//         return res.status(200).json("Okay"); 
//     } catch (err) {
//         res.status(500).send(err.message); 
//     }
// }