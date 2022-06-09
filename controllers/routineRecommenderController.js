var RecRoutine = require('../models/Routine'); 
var User = require('../models/User'); 
var vectorsUtil = require('../utils/vectors'); 

exports.getSimilarRoutines = async (req, res) => {
    try {
        const { id } = req.user; 
        //Find a way so that this should not re-run everytime 
        const selectedRoutines = await RecRoutine.find({}, '_id genre'); 
        const formattedData = vectorsUtil.formatRoutine(selectedRoutines); 
        var user = await User.findById(id); 
        var trainedData = vectorsUtil.createVectorsFromData(formattedData); 

        let similarRoutines = vectorsUtil.returnSimilarItems(user, trainedData); 

        let routines = []; 

        for (let i = 0; i < similarRoutines.length; i++) {
            var item = similarRoutines[i]; 
            const routine = await RecRoutine.findById(item._id.toString());
            routines.push(routine); 
        }

        res.status(200).json(routines); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}