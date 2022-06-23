var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var NotiSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true 
    }, 
    message: {
        type: String, 
        required: true
    }, 
    page: {
        type: String, 
        required: true, 
        enum: ["Routine", "Story", "Chat", "Profile", "Settings", "Calendar"]
    }, 
    timeNotify: {
        type: Date, 
        required: true 
    }
})

module.exports = mongoose.model('Noti', NotiSchema); 