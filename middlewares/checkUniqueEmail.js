var User = require('../models/User'); 

exports.checkUniqueEmail = async (req, res, next) => {
    
    User.findOne({
        email: req.body.email
    }, (err, result) => {
        if (err) {
            return res.status(500).send({message: err}); 
        }
        else if (result) {
            return res.status(400).send({message: "User already existed"}); 
        }
        next(); 
    })
}

