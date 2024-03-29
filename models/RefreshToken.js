var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var TokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User',
    },
    token: {
        type: String, 
        required: true 
    },
    expiredAt: {
        type: Date, 
        expires: Number(process.env.REFRESH_TOKEN_TIME), 
    }
})

module.exports = mongoose.model('RefreshToken', TokenSchema); 
