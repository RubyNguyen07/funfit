var Conversation = require('../models/Conversation'); 
var User = require('../models/User');
var Message = require('../models/Message');
var mongoose = require('mongoose');
var { sendEmail } = require('./email/sendEmail');

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

                var convo = await Conversation.findById(socket.activeConvo);
                if (!convo) {
                    console.log("Convo does not exist");
                }
                
                console.log(convo.users);
                console.log(userId); 
                const receiverId = convo.users.filter(id => id.toString() !== userId)[0];
                const receiver = await User.findById(receiverId, 'email');
                console.log(receiver);
                const sender = await User.findById(userId, 'name');

                sendEmail(
                    receiver.email, 
                    "New message", 
                    `Hi, you received a new message from ${sender.name}`
                );
            } catch (err) {
                console.error(err); 
            }
        })
    })
}