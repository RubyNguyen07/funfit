var User = require('../models/User'); 
var ReminderList = require('../models/ReminderList');
var DaysFollow = require('../models/DaysFollow');
var bcrypt = require('bcryptjs/dist/bcrypt');
var jwt = require('jsonwebtoken');
var RefreshToken = require('../models/RefreshToken'); 
var ResetToken = require('../models/ResetToken'); 
var randomstring = require('randomstring');
var { sendEmail } = require('../utils/email/sendEmail'); 
var { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');

// Create new account
exports.signup = async (req, res) => {
    try {
        const user = new User({
            email: req.body.email.toLowerCase(), 
            password: req.body.password, 
            sex: req.body.sex, 
            country: req.body.country, 
            name: req.body.name, 
        })

        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT)); 
        user.password = await bcrypt.hash(user.password, salt); 

        await user.save(); 
        
        const payload = {
            user: {
                id: user._id
            }
        }

        // Generate token to log in 
        jwt.sign(
            payload, 
            process.env.SECRET_KEY, 
            {
                expiresIn: Number(process.env.TOKEN_TIME)
            }, 
            (err, token) => {
                if (err) throw err; 
                res.status(201).json({
                    token
                }); 
            }
        ); 

    } catch (e) {
        res.status(500).send(e.message); 
    }
}

// Sign in 
exports.login = async (req, res) => {
    try {
        // Check if user exists, if no then throw error
        var user = await User.findOne({
            email: req.body.email.toLowerCase()
        });
        if (!user) {
            return res.status(400).send({message: "User does not exist"});
        }

        // Check if password is typed correctly 
        const isMatch = await bcrypt.compare(req.body.password, user.password); 
        if (!isMatch) {
            return res.status(400).send({message: "Incorrect password"}); 
        }

        // Generate refresh token 
        var autoToken = uuidv4(); 
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT)); 
        const hashedToken = await bcrypt.hash(autoToken, salt); 
        const refreshToken = new RefreshToken({
            userId: user._id, 
            token: hashedToken, 
            expiredAt: new Date()
        })
        await refreshToken.save(); 

        const payload = {
            user: {
                id: user._id
            }
        }

        jwt.sign(
            payload, 
            process.env.SECRET_KEY, 
            {
                expiresIn: Number(process.env.TOKEN_TIME)
            }, 
            (err, token) => {
                if (err) throw err; 
                res.status(200).json({
                    token: token, 
                    refreshToken: hashedToken
                }); 
            }
        )
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Use given refresh token to generate new token to log in 
exports.refreshToken = async (req, res) => {
    try {
        if (req.body.refreshToken == null) {
            return res.status(500).send(err.message); 
        }

        const token = await RefreshToken.findOne({token: req.body.refreshToken}); 

        if (!token) {
            return res.status(400).send("Refresh token expired or did not exist"); 
        }

        const payload =  {
            user: {
                id: token.userId
            }
        };

        jwt.sign(
            payload, 
            process.env.SECRET_KEY, 
            {
                expiresIn: Number(process.env.TOKEN_TIME)
            }, 
            (err, token) => {
                if (err) throw err; 
                res.status(201).json({
                    token
                }); 
            }
        )
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Generate new code to reset password
exports.forgotPassword = async (req, res) => {
    try {
        // Check if user exists, if no then throw error 
        const user = await User.findOne({email: req.body.email.toLowerCase()}); 
        if (!user) {
            return res.status(400).send("User does not exist"); 
        } 

        // Delete old refresh token 
        const refreshToken = await RefreshToken.findOne({ userId: user._id }); 
        if (refreshToken) {
            await refreshToken.deleteOne(); 
        }

        // Generate code to reset password 
        const code = randomstring.generate({length: Number(process.env.CODE_LENGTH), charset: 'alphanumeric'}); 
        const hashedCode = await bcrypt.hash(code, Number(process.env.BCRYPT_SALT)); 

        await new ResetToken({
            userId: user._id, 
            token: hashedCode, 
            expiredAt: new Date()
        }).save() 

        sendEmail(
            user.email, 
            "Password Reset Request", 
            "Hi " + user.name + ", you have requested to reset your password on Funfit. Please enter the following code to reset password: " + code + "." 
        );
        res.status(200).send({userId: user._id}); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
} 

// Use given code to reset password 
exports.passwordReset = async (req, res) => {
    var { userId, password, code } = req.body; 

    if (!code) {
        return res.status(400).send("Code missing"); 
    }

    if (!password || password.length == 0) {
        return res.status(400).send("New password missing"); 
    }

    if (code.length != Number(process.env.CODE_LENGTH)) {
        return res.status(400).send("Invalid password reset token"); 
    }

    var passwordResetToken = await ResetToken.findOne({userId: userId}); 

    if (!passwordResetToken) {
        return res.status(400).send("Invalid or expired password reset token"); 
    }

    const isMatch = await bcrypt.compare(code, passwordResetToken.token); 

    if (!isMatch) {
        return res.status(400).send("Invalid password reset token"); 
    }

    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT)); 
    const hash = await bcrypt.hash(password, salt); 

    const user = await User.findById({_id: userId});

    const sess = await mongoose.startSession(); 
    await sess.withTransaction( async () => {
        await User.updateOne(
            {
                _id: userId, 
            }, 
            {
                $set: {
                    password: hash
                }
            }, 
            {
                new: true
            }, 
            {
                session: sess
            }
        ); 

        await passwordResetToken.deleteOne({ session: sess }); 
    }); 

    sendEmail(
        user.email, 
        "Password Reset Successfully", 
        "Hi " + user.name + ", you have successfully reset your password on Funfit"
    ); 

    return res.status(200).send("Password reset successfully"); 
}

// Fetch user own profile
exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, 'email sex country name age lifestyleTarget workoutInterests points level'); 
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({message: "Error in fetching user"}); 
    }
}

// Update user's own profile 
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.user; 
        const user = await User.findOneAndUpdate({_id: id}, req.body, { new: true }); 
        res.status(200).json(user); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

// Fetch a user profile with given id 
exports.getUserProfile = async (req, res) => {
    try {
        const { otherId } = req.query; 
        const user = await User.findById(otherId, 'sex country name age lifestyleTarget workoutInterests points level'); 

        if (!user) {
            return res.status(400).send({message: 'This user does not exist'});
        }

        return res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Get user's level and points 
exports.getLevel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, 'points level'); 
        return res.status(200).send({
            level: user.level, 
            points: user.points
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Fetch days completing any routines
exports.getDaysFollow = async (req, res) => {
    try {
        const item = await DaysFollow.findOne({ userId: req.user.id }, 'daysFollow');
        if (!item) {
            return res.status(200).send("You haven't completed any routine yet")
        }
        res.status(200).send(item.daysFollow);  
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// // Fetch level and points of a user 
// exports.getLevel = async (req, res) => {
//     try {
//         const user = await User.findById(req.query.id);
//         // var badge = '';
//         // if (level > 0 && level < 6) {
//         //     badge =  'Iron'
//         // } else if (level > 5 && level < 9) {
//         //     badge =  'Bronze'
//         // } else if (level > 8 && level < 12) {
//         //     badge =  'Silver'
//         // } else if (level > 11 && level < 12) {
//         //     badge =  'Silver'
//         // }
//         res.status(200).send({
//             level: user.level, 
//             points: user.points
//         })
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// }

// Fetch list of reminders to do routines 
exports.getReminderList = async (req, res) => {
    try {
        const item = await ReminderList.findOne({ userId: req.user.id });
        if (!item) {
            return res.status(200).send("No reminder added yet")
        }
        res.status(200).send(item.reminderList); 
    } catch (err) {
        res.status(500).send(err.message);
    }
}