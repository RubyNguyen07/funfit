var User = require('../models/User'); 
var bcrypt = require('bcryptjs/dist/bcrypt');
var jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    try {
        const user = new User({
            email: req.body.email.toLowerCase(), 
            password: req.body.password, 
            sex: req.body.sex, 
            country: req.body.country, 
            name: req.body.name, 
        })

        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(user.password, salt); 

        await user.save(); 

        
        const payload = {
            user: {
                id: user._id
            }
        }

        jwt.sign(
            payload, 
            process.env.SECRET_KEY, 
            {
                expiresIn: 10000
            }, 
            (err, token) => {
                if (err) throw err; 
                res.status(200).json({
                    token
                }); 
            }
        ); 

    } catch (e) {
        res.status(500).send(e.message); 
    }
}

exports.login = async (req, res) => {
    try {
        var user = await User.findOne({
            email: req.body.email.toLowerCase()
        });
        if (!user) {
            return res.status(400).send("User does not exist");
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password); 
        if (!isMatch) {
            return res.status(400).send("Incorrect password"); 
        }

        const payload = {
            user: {
                id: user._id
            }
        }

        jwt.sign(
            payload, 
            process.env.SECRET_KEY, 
            {
                expiresIn: 10000
            }, 
            (err, token) => {
                if (err) throw err; 
                res.status(200).json({
                    token
                }); 
            }
        )
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); 
        res.json(user);
    } catch (err) {
        res.status(500).json({message: "Error in fetching user"}); 
    }
}

exports.logout = async (req, res) => {
    res.status(200).json({message: "Logged out"}); 
}