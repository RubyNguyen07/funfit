var User = require('../models/User'); 

exports.checkUniqueEmail = async (req, res, next) => {
    
    await User.findOne({
        email: req.body.email.toLowerCase()
    }, (err, result) => {
        if (err) {
            return res.status(500).send(err.message); 
        }
        else if (result) {
            return res.status(400).send({message: "User already existed"}); 
        }
        next(); 
    })
}

