var mongoose = require('mongoose'); 
var { getNames } = require('country-list'); 
var { isEmail } = require('validator'); 

var Schema = mongoose.Schema; 

var UserSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        validate : [isEmail, 'invalid email']
    }, 
    password: {
        type: String, 
        required: true, 
        minLength: 5
    }, 
    sex: {
        type: String, 
        enum: ['Female', 'Male', 'Others'], 
        required: true
    }, 
    country: {
        type: String, 
        required: true, 
        enum: getNames()
    }, 
    profilePic: {
        type: String, 
        default: ""
    }, 
    name: {
        type: String, 
        required: true
    }, 
    age: {
        type: Number, 
        validate: {
            validator: Number.isInteger, 
            message: '{VALUE} is not an integer value'
        }
    }, 
    lifestyleTarget: {
        type: String
    }, 
    workoutInterests: {
        type: String, 
        enum: ['Strength training', 'Yoga', 'Cardio', 'Powerbuilding', 'Others'] 
    }, 
    points: {
        type: Number, 
        validate: {
            validator: Number.isInteger, 
            message: '{VALUE} is not an integer value'
        }
    }, 
    level: {
        type: Number, 
        validate: {
            validator: Number.isInteger, 
            message: '{VALUE} is not an integer value'
        }
    }, 
    friends: [{
        type: Schema.Types.ObjectId, 
        ref: 'UserSchema'
    }]
})

module.exports = mongoose.model('User', UserSchema);