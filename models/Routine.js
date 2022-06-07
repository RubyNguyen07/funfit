var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var RoutineSchema = new Schema({
    name: {
        type: String, 
        required: true
    }, 
    duration: {
        type: Date, 
        required: true
    }, 
    steps: {
        type: [String], 
        required: true
    }, 
    timings: {
        type: [Date], 
        required: true
    }, 
    genre: {
        type: [String], 
        required: true 
    }
})

module.exports = mongoose.model('RecRoutine', RoutineSchema); 