var Conversation = require('../models/Conversation'); 
var Message = require('../models/Message');
var mongoose = require('mongoose');

exports.chatConfig = (io) => {
    io.on('connection', async (socket) => {
        socket.on('join', async ({ chatId }) => {
            try {
                socket.join(chatId); 
                socket.emit('joined', chatId); 
                socket.activeConvo = chatId;  
            } catch (err) {
                console.error(err); 
            }
        })

        socket.on('send new message', async ({ content, userId }) => {
            try {
                const sess = await mongoose.startSession(); 
                var newMessage = new Message({
                    sender: userId, 
                    content: content, 
                    image: ""
                });
                var convo = await Conversation.findById(socket.activeConvo);
                convo.messages.push(newMessage); 

                await sess.withTransaction( async () => {
                    await newMessage.save(); 
                    await convo.save(); 
                })

                socket.to(socket.activeConvo).emit('receive new message', newMessage); 
            } catch (err) {
                console.error(err); 
            }
        })
    })
}