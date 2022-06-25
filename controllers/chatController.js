var Conversation = require('../models/Conversation');
var User = require('../models/User'); 

exports.getAllConversations = async (req, res) => {
    try {
        const { id } = req.user; 

        var user = await User.findById(id, 'conversations').populate({
            path: 'conversations', 
            select: 'users messages updatedAt', 
            populate: [
                { 
                    path: 'users', 
                    select: '_id name', 
                    model: 'User'
                }, 
                {
                    path: 'messages', 
                    select: 'content createdAt', 
                    model: 'Message'
                }
            ], 
            options: { sort: { updatedAt: -1 } }
        }); 

        const conversations = user.conversations; 

        var toReturn = conversations.map(convo => {
            var numOfMessages = convo.messages.length; 

            return {
                friend: convo.users.filter((user) => user._id != id), 
                convoId: convo._id, 
                latestMessage: numOfMessages > 0 ? convo.messages[numOfMessages - 1].content : "", 
                updatedAt: convo.updatedAt
            };
        });
        res.status(200).send(toReturn);

    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.getConversationById = async (req, res) => {
    try {
        const { convoId } = req.body; 

        const convo = await Conversation.findById(convoId, 'users messages updatedAt').populate([
            {
                path: 'users', 
                select: '_id name', 
                model: 'User'
            },
            {
                path: 'messages',
                select: 'content createdAt', 
                model: 'Message'
            }
        ]); 

        res.status(200).send(convo); 
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.initiateChat = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { anotherUserId } = req.body; 

        const anotherUser = await User.findById(anotherUserId);
        if (!anotherUser) {
            return res.status(400).send("This user does not exist");
        }

        const user = await User.findById(userId, 'friends');
        const friends = user.friends; 

        // If one user decided to delete the chat, then all the chat disappeared for both users 
        // (~ like block unless suggested again, but still should be in friends array so that will not 
        // be suggested again)
        if (!friends.includes(anotherUserId)) {
            const newConvo = new Conversation({
                users: [userId, anotherUserId]
            })
            await newConvo.save(); 
            
            const user = await User.findById(userId); 
            user.friends.push(anotherUserId); 
            user.conversations.push(newConvo._id); 
            await user.save(); 

            anotherUser.friends.push(userId); 
            anotherUser.conversations.push(newConvo._id); 
            await anotherUser.save(); 

            return res.status(200).send("New conversation started");
        }

        return res.status(400).send("Already has conversation with this person or This person has been blocked");

    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.deleteConvo = async (req, res) => {
    try {
        const { convoId, anotherUserId } = req.body; 
        const userId = req.user.id; 

        const hasDeleted = await Conversation.findByIdAndDelete(convoId); 

        const user = await User.findById(userId); 
        user.conversations = user.conversations.filter(id => id !== convoId); 
        await user.save(); 

        const anotherUser = await User.findById(anotherUserId); 
        anotherUser.conversations = anotherUser.conversations.filter(id => id !== convoId); 
        await anotherUser.save(); 

        if (hasDeleted) {
            return res.status(200).send("Conversation deleted")
        }

        return res.status(400).send("Conversation does not exist"); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}
