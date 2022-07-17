var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var CalendarListSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true 
    },
    calendarList: {
        type: Schema.Types.Map, 
        default: new Map()
    }
});

module.exports = mongoose.model('CalendarList', CalendarListSchema);