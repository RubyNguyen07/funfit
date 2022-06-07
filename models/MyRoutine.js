var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var MyRoutineSchema = new Schema({
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
    }
})

module.exports = mongoose.model('MyRoutine', MyRoutineSchema); 


