var graphUtil = require('../utils/friendsRecommender');
var vectorUtil = require('../utils/vectors');
var graphHelper = require('../app');
var User = require('../models/User');
var RecFriends = require('../models/RecFriends');

// Return list of recommended friends 
exports.getRecommendedFriends = async (req, res) => {
    try {
        const { id } = req.user; 
        // Check if there exists a valid list of recommended friends 
        const recFriends = await RecFriends.findOne({userId: id}); 
        if (recFriends) {
            return res.status(200).send(recFriends.recFriends); 
        }

        const user = await User.findById(id); 
        var userToReturn = 15; 
        var recUsersFromVectors = [];
        var recUsersFromGraph = []; 

        const getFriendsFromInterests = async () => {
            const selectedUsers = []; 
            const friends = user.friends;
            const blackList =  user.blackList; 
            await User.find().select('_id country workoutInterests').cursor().eachAsync(doc => {
                // Select potential users who are not currently friends or in the blacklist 
                if (!friends.includes(doc._id) && !blackList.includes(doc._id)) {
                    selectedUsers.push(doc);
                } 
            })

            const formattedData = vectorUtil.formatUser(selectedUsers, id); 
            var trainedData = vectorUtil.createVectorFromUsers(formattedData); 
            let similarUsers = vectorUtil.returnSimilarItems(user, trainedData, "user"); 
        
            for (let i = 0; i < similarUsers.length; i++) {
                var item = similarUsers[i]; 
                recUsersFromVectors.push(item._id.toString());
            }
        }

        // If user does not have any friends yet, then generate friends 
        // based on interests (using content-based recommender system)
        if (user.friends.length === 0) {
            await getFriendsFromInterests(); 
            var res = recUsersFromVectors.slice(0, userToReturn); 

            await new RecFriends({
                userId: id, 
                recFriends: res, 
                expiredAt: new Date()
            }).save();

            return res.status(200).send(res);
        }

        // Find recommended friends who are not in blacklist 
        var recUsersFromGraphRaw = graphUtil.findNeighbors(graphHelper.graph, id); 
        var recUsersFromGraph = recUsersFromGraphRaw.filter(id => !user.blackList.includes(id)); 

        var currLen = recUsersFromGraph.length;
        // Check if current list of recommended friends are less than the limit given 
        // If yes, generate more from content-based recommender system 
        if (currLen < userToReturn) {
            await getFriendsFromInterests(); 
            recUsersFromGraph.push(...recUsersFromVectors.slice(0, userToReturn - currLen));

            await new RecFriends({
                userId: id, 
                recFriends: recUsersFromGraph, 
                expiredAt: new Date()
            }).save();

            return res.status(200).send(recUsersFromGraph);
        } else {
            // If not, then cut the current array to the limit given, leaving only 15 most similar users 
            var res = recUsersFromGraph.slice(0, userToReturn); 

            await new RecFriends({
                userId: id, 
                recFriends: res, 
                expiredAt: new Date()
            }).save();

            return res.status(200).send(res);
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
}