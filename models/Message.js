var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var MessageSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId, 
        required: true, 
        ref: 'User'
    }, 
    content: {
        type: String, 
        required: true
    }, 
    // image: {
    //     type: String
    // }
}, { timestamps: true});

module.exports = mongoose.model('Message', MessageSchema);