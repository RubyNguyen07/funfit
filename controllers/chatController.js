var Conversation = require('../models/Conversation');
var User = require('../models/User'); 
var mongoose = require('mongoose'); 

// Fetch all conversations user used to have 
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
                    select: 'sender content createdAt', 
                    model: 'Message'
                }
            ], 
            options: { sort: { updatedAt: -1 } }
        }); 

        const conversations = user.conversations; 

        var toReturn = conversations.map(convo => {
            var numOfMessages = convo.messages.length; 

            // Format conversation returned with the following fields 
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

// Fetch a conversation with given id 
exports.getConversationById = async (req, res) => {
    try {
        const { convoId } = req.query; 

        const convo = await Conversation.findById(convoId, 'users messages updatedAt').populate([
            {
                path: 'users', 
                select: '_id name', 
                model: 'User'
            },
            {
                path: 'messages',
                select: 'sender content createdAt', 
                model: 'Message'
            }
        ]); 

        res.status(200).send(convo); 
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Start a new conversation with a user
exports.initiateChat = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { anotherUserId } = req.body; 
        // Check if another user with given id exists 
        const anotherUser = await User.findById(anotherUserId);
        if (!anotherUser) {
            return res.status(400).send("This user does not exist");
        }

        const user = await User.findById(userId);
        const friends = user.friends; 

        // If one user decided to delete the chat, then all the chat disappeared for both users 
        // (it is similar to blocking unless still in suggested friends list, but should be in blacklist array 
        // so that the blocked user will not be suggested as friends again)
        if (!friends.includes(anotherUserId)) {
            const newConvo = new Conversation({
                users: [userId, anotherUserId]
            })

            user.friends.push(anotherUserId); 
            user.conversations.push(newConvo._id); 

            anotherUser.friends.push(userId); 
            anotherUser.conversations.push(newConvo._id); 

            const sess = await mongoose.startSession();
            await sess.withTransaction( async () => {
                await newConvo.save({ session: sess });
                await user.save({ session: sess });
                await anotherUser.save({ session: sess }); 
            });

            return res.status(201).send(newConvo._id);
        } 

        return res.status(400).send("Already has conversation with this person or This person has been blocked");

    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Delete a conversation 
exports.deleteConvo = async (req, res) => {
    try {
        const { convoId, anotherUserId } = req.body; 
        const userId = req.user.id; 

        const hasDeleted = await Conversation.findByIdAndDelete(convoId); 
        const user = await User.findById(userId); 
        const anotherUser = await User.findById(anotherUserId); 

        if (hasDeleted == null) {
            return res.status(400).json({message:"Conversation or Participants do not exist"});
        }

        // Delete conversation from current conversation list
        user.conversations = user.conversations.filter(id => id !== convoId); 
        // Delete from friends list 
        user.friends = user.friends.filter(id => id !== anotherUserId);
        // Put into user's blacklist 
        user.blackList.push(anotherUserId); 

        // Delete conversation from current conversation list
        anotherUser.conversations = anotherUser.conversations.filter(id => id !== convoId); 
        // Delete from friends list 
        anotherUser.friends = anotherUser.friends.filter(id => id !== userId);
        // Put into user's blacklist 
        anotherUser.blackList.push(userId);  

        const sess = await mongoose.startSession(); 
        await sess.withTransaction(async () => {
            await user.save({ session: sess }); 
            await anotherUser.save({ session: sess }); 
        })

        if (hasDeleted) {
            return res.status(204).end()
        }

        return res.status(400).json({message: "Conversation does not exist"}); 

    } catch (err) {
        res.status(500).send(err.message); 
    }
}