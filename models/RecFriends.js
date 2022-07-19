var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var RecFriendsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recFriends: {
        type: [Schema.Types.ObjectId], 
        ref: 'User'
    }, 
    expiredAt: {
        type: Date, 
        expires: Number(process.env.REC_FRIENDS_TIME) /* New friennds rec every 3 days */ 
    }
})

module.exports = mongoose.model('RecFriends', RecFriendsSchema);