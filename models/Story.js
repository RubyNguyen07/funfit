var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var StorySchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    filename: {
        type: String, 
        required: true
    },
    contentType: {
        type: String, 
        required: true 
    }, 
    expiredAt: {
        type: Date, 
        expires: Number(process.env.STORY_TIME), 
    }
}); 

module.exports = mongoose.model('Story',  StorySchema);
