var graphUtil = require('../utils/friendsRecommender');
var vectorUtil = require('../utils/vectors');
var graphHelper = require('../app');
var User = require('../models/User');
var RecFriends = require('../models/RecFriends');

exports.getRecommededFriends = async (req, res) => {
    try {
        const { id } = req.user; 

        const recFriends = await RecFriends.findOne({userId: id}); 

        if (recFriends) {
            return res.status(200).send(recFriends.recFriends); 
        }

        const user = await User.findById(id); 
        var userToReturn = 15; 
        var recUsersFromVectors = [];
        var recUsersFromGraph = []; 

        const getFriendsFromInterests = async () => {
            // const selectedUsers = await User.find({}, '_id country workoutInterests'); 

            const selectedUsers = []; 
            const friends = user.friends;
            await User.find().select('_id country workoutInterests').cursor().eachAsync(doc => {
                if (!friends.includes(doc._id)) {
                    selectedUsers.push(doc);
                } 
            })

            const formattedData = vectorUtil.formatUser(selectedUsers, id); 

            var trainedData = vectorUtil.createVectorFromUsers(formattedData); 
    
            let similarUsers = vectorUtil.returnSimilarUsers(user, trainedData); 
        
            for (let i = 0; i < similarUsers.length; i++) {
                var item = similarUsers[i]; 
                // const recUser = await User.findById(item._id.toString());
                recUsersFromVectors.push(item._id.toString());
                // recUsersFromVectors.push(recUser); 
            }
        }

        if (user.friends.length === 0) {
            await getFriendsFromInterests(); 

            var res = recUsersFromVectors.slice(0, userToReturn); 

            await new RecFriends({
                userId: id, 
                recFriends: res, 
                expiredAt: new Date()
            }).save();

            req.idArray = res; 
        } else {
            var recUsersFromGraph = graphUtil.findNeighbors(graphHelper.graph, id); 
            // recFriendsId.forEach(async id => {
            //     const newFriend = await User.findById(id); 
            //     recUsersFromGraph.push(newFriend);
            // })
    
            var currLen = recUsersFromGraph.length;
            if (currLen < userToReturn) {
                await getFriendsFromInterests(); 
                recUsersFromGraph.push(...recUsersFromVectors.slice(0, userToReturn - currLen));
    
                await new RecFriends({
                    userId: id, 
                    recFriends: recUsersFromGraph, 
                    expiredAt: new Date()
                }).save();
    
                req.idArray = recUsersFromGraph;
            } else {
                var res = recUsersFromGraph.slice(0, userToReturn); 
    
                await new RecFriends({
                    userId: id, 
                    recFriends: res, 
                    expiredAt: new Date()
                }).save();
    
                req.idArray = res;
            }
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
}