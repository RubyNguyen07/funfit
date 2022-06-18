var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var StorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true
    }, 
    content: {
        type: String, 
        required: true
    }, 
    likes: {
        type: Number, 
        required: true
    }, 
    expiredAt: {
        type: Date, 
        expires: 24 * 60 * 60 * 1000 
    }
})

module.exports = mongoose.model('Story', StorySchema);