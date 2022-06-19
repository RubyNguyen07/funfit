var graphUtil = require('../utils/friendsRecommender');
var vectorUtil = require('../utils/vectors');
var graphHelper = require('../app');
var User = require('../models/User');

exports.getRecommededFriends = async (req, res) => {
    try {
        const { id } = req.user; 
        const user = await User.findById(id); 
        var userToReturn = 15; 
        var recUsersFromVectors = [];
        var recUsersFromGraph = []; 

        const getFriendsFromInterests = async () => {
            const selectedUsers = await User.find({}, '_id country workoutInterests'); 

            const formattedData = vectorUtil.formatUser(selectedUsers, id); 

            var trainedData = vectorUtil.createVectorFromUsers(formattedData); 
    
            let similarUsers = vectorUtil.returnSimilarUsers(user, trainedData); 
        
            for (let i = 0; i < similarUsers.length; i++) {
                var item = similarUsers[i]; 
                const recUser = await User.findById(item._id.toString());
                recUsersFromVectors.push(recUser); 
            }
        }

        if (user.friends.length === 0) {
            await getFriendsFromInterests(); 
            return res.status(200).send(recUsersFromVectors.slice(0, userToReturn));
        }

        var recFriendsId = graphUtil.findNeighbors(graphHelper.graph, id); 
        console.log(recFriendsId);
        recFriendsId.forEach(async id => {
            const newFriend = await User.findById(id); 
            recUsersFromGraph.push(newFriend);
        })

        var currLen = recUsersFromGraph.length;
        if (currLen < userToReturn) {
            await getFriendsFromInterests(); 
            console.log(recUsersFromVectors)
            recUsersFromGraph.push(...recUsersFromVectors.slice(0, userToReturn - currLen));
            return res.status(200).send(recUsersFromGraph);
        } else {
            return res.status(200).send(recUsersFromGraph.slice(0, userToReturn));
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
}