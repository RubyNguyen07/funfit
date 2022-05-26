var User = require('../models/User'); 

exports.checkUniqueEmail = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }, (err, result) => {
        if (err) {
            res.status(500).send({message: err}); 
        }
        if (result) {
            res.status(400).send({message: "User already existed"}); 
        }
        return; 
    })
    next(); 
}

