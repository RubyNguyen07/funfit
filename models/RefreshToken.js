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
        expires: 30 * 24 * 60 * 60, 
    }
})

module.exports = mongoose.model('RefreshToken', TokenSchema); 
