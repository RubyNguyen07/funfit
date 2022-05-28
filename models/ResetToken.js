var mongoose = require('mongoose'); 
var User = require('./User'); 

var Schema = mongoose.Schema; 

var TokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    },
    token: {
        type: String, 
        required: true 
    },
    expiredAt: {
        type: Date, 
        expires: 2 * 60, 
    }
})

module.exports = mongoose.model('ResetToken', TokenSchema); 
