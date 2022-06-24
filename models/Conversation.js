var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var ConversationSchema = new Schema({
    users: {
        type: [mongoose.Types.ObjectId], 
        required: true, 
        unique: true  
    }, 
    messages: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Message'
    }]
}, { timestamps: true});

module.exports = mongoose.model('Conversation', ConversationSchema); 