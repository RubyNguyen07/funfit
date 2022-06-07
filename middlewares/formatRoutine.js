var RecRoutine = require('../models/Routine'); 

exports.formatRoutine = async (req, res, next) => {
    try {
        const formattedRoutine = await RecRoutine.find({}, '_id genre'); 
        formattedRoutine.forEach(item => {
            item.genre = item.genre.join(" "); 
        });
        
        next(); 
    } catch (err) {
        console.log(err); 
        return res.status(500).json(err.message)
    }
}
