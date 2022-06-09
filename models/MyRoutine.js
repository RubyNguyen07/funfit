var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var MyRoutineSchema = new Schema({
    name: {
        type: String, 
        required: true
    }, 
    duration: {
        type: [String], 
        required: true
    }, 
    steps: {
        type: [String], 
        required: true
    }, 
    timings: {
        type: [[String]], 
        required: true
    }, 
    genre: {
        type: [String] 
    }, 
    userId: {
        type: Schema.Types.ObjectId
    }, 
    reminder: {
        type: Date 
    }, 
    daysFollow: {
        type: [Date]
    }, 
    audioGenerated: {
        type: Schema.Types.Boolean, 
        default: false 
    }, 
    youtubeVideo: {
        type: String
    }, 
    thumbnail: {
        type: String
    }, 
    difficulty: {
        type: String 
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('MyRoutine', MyRoutineSchema); 


