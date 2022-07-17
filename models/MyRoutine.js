var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var MyRoutineSchema = new Schema({
    name: {
        type: String, 
        required: true
    }, 
    duration: {
        type: [String], 
        required: true,
        default: [""]
    }, 
    steps: {
        type: [String], 
        required: true,
        default: [""]
    }, 
    timings: {
        type: [[String]], 
        required: true,
        default: [[""]]
    }, 
    genre: {
        type: [String] 
    }, 
    userId: {
        type: Schema.Types.ObjectId
    }, 
    // reminder: {
    //     type: Date 
    // }, 
    // daysFollow: {
    //     type: [Date]
    // }, 
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


