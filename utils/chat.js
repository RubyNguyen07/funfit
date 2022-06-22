var Conversation = require('../models/Conversation'); 
var Message = require('../models/Message');

exports.chatConfig = (io) => {
    io.on('connection', async (socket) => {
        socket.on('join', async ({ chatId }) => {
            try {
                // We can take the _id of the conversation to make this 
                socket.join(chatId); 
                socket.emit('joined', chatId); 
                socket.activeConvo = chatId;  
            } catch (err) {
                console.error(e); 
            }
        })

        socket.on('send new message', async ({ content, userId }) => {
            try {
                var newMessage = new Message({
                    sender: userId, 
                    content: content, 
                    image: ""
                });
                await newMessage.save(); 

                var convo = await Conversation.findById(socket.activeConvo);
                convo.messages.push(newMessage); 
                await convo.save(); 

                socket.to(socket.activeConvo).emit('receive new message', message); 
            } catch (err) {
                // Change into log later 
                console.error(e); 
            }
        })
    })
}