var mongoose = require('mongoose'); 
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
        type: [String], 
        enum: ['cardio', 'yoga', 'pilates', 'fat-burning', 'no-equipment', 'full-body-workout']
    }, 
    points: {
        type: Number, 
        validate: {
            validator: Number.isInteger, 
            message: '{VALUE} is not an integer value'
        }, 
        default: 0
    }, 
    level: {
        type: Number, 
        validate: {
            validator: Number.isInteger, 
            message: '{VALUE} is not an integer value'
        }, 
        default: 1 
    }, 
    friends: [{
        type: mongoose.Types.ObjectId, 
        ref: 'User'
    }], 
    blackList: [{
        type: mongoose.Types.ObjectId, 
        ref: 'User'
    }], 
    conversations: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Conversation'
    }], 
    daysFollow: {
        type: mongoose.Types.Map, 
        of: [String]
    }
})

module.exports = mongoose.model('User', UserSchema);