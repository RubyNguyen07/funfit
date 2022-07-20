var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var DaysFollowSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true 
    },
    daysFollow: {
        type: Schema.Types.Map, 
        of: [String],
        default: new Map()
    }
});

module.exports = mongoose.model('DaysFollow', DaysFollowSchema);