var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var RoutineSchema = new Schema({
    name: {
        type: String, 
        required: true
    }, 
    description: {
        type: String, 
        required: true 
    }, 
    duration: {
        type: Date, 
        required: true
    }, 
    genre: {
        type: [String], 
        required: true 
    }, 
    youtubeVideo: {
        type: String,
        required: true
    }, 
    thumbnail: {
        type: String, 
        required: true
    }, 
    difficulty: {
        type: String 
    }
})

module.exports = mongoose.model('RecRoutine', RoutineSchema); 