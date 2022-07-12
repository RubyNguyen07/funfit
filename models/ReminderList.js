var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var ReminderListSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true 
    },
    reminderList: {
        type: Schema.Types.Map, 
        of: [String],
        default: new Map()
    }
});

module.exports = mongoose.model('ReminderList', ReminderListSchema);