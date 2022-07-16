var User = require('../models/User'); 

exports.checkUniqueEmail = async (req, res, next) => {
    try {
        if (req.body.email == null) {
            return res.status(400).send({message: "Email field is empty"});
        }
        const user = await User.findOne({
            email: req.body.email.toLowerCase()
        }); 
        if (user) {
            return res.status(400).send({message: "User already existed"}); 
        }
        next(); 
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

