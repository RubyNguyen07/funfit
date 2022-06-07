var User = require('../models/User'); 
var bcrypt = require('bcryptjs/dist/bcrypt');
var jwt = require('jsonwebtoken');
var RefreshToken = require('../models/RefreshToken'); 
var ResetToken = require('../models/ResetToken'); 
var randomstring = require('randomstring');
var { sendEmail } = require('../utils/email/sendEmail'); 
var { v4: uuidv4 } = require('uuid'); 

exports.getAll = async (req, res) => {
    try {
        const users = await User.find(); 
        res.json(users); 
    } catch (err) {
        res.status(500).send(err.message);
    }
}


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

        jwt.sign(
            payload, 
            process.env.SECRET_KEY, 
            {
                expiresIn: Number(process.env.TOKEN_TIME)
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
                res.status(200).json({
                    token
                }); 
            }
        )
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email.toLowerCase()}); 
        
        if (!user) {
            return res.status(400).send("User does not exist"); 
        } 

        const refreshToken = await RefreshToken.findOne({ userId: user._id }); 
        if (refreshToken) {
            await refreshToken.deleteOne(); 
        }

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
        }
    ); 

    const user = await User.findById({_id: userId});

    sendEmail(
        user.email, 
        "Password Reset Successfully", 
        "Hi " + user.name + ", you have successfully reset your password on Funfit"
    ); 

    await passwordResetToken.deleteOne(); 
    return res.status(200).send("Password reset successfully"); 
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

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.user; 
        const user = await User.findOneAndUpdate({_id: id}, req.body, { new: true }); 
        res.status(200).json(user); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}