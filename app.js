var express = require('express'); 
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser'); 
var helmet = require("helmet"); 
var cors = require('cors'); 
var socket = require('socket.io');
require('dotenv').config(); 
var InitiateMongoServer = require('./config/db');
var { chatConfig } = require('./utils/chatUtil'); 

var user = require('./routes/users'); 
var routine = require('./routes/routines'); 
// var homeController = require('./controllers/homeController');
var story = require('./routes/stories');
var chat = require('./routes/chats');

let ug = require('ug'); 
let inputGraph = new ug.Graph();
let helper = require('./utils/friendsRecommenderUtil');

// Start mongodb 
InitiateMongoServer().then(async () => {
    // Create friends graph 
    await helper.createGraph(inputGraph);
})
exports.graph = inputGraph; 

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(helmet());
app.use(cors()); 


app.use('/user', user); 
app.use('/routine', routine); 
app.use('/story', story);
// app.use('/story', homeController.getHome);
// app.use('/noti', noti);
app.use('/chat', chat);

// app.get('/', (req, res) => {
//     res.status(200); 
//     res.send("Welcome, Ruby"); 
// })

// var utilss = require('./utils/friendsRecommender'); 
// utilss.findNeighbors("6291de8d0c29404a0e5c1502"); 

// app.get('/story', homeController.getHome); 

var server = app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running and listening on port: " + port); 
    } else {
        console.log("Error: " + err); 
    }
})

var io = socket(server, {
    cors: {
        origin: true,
    }
}); 

var chatFunfit = io.of('/chatFunfit');
chatConfig(chatFunfit); 

exports.app = app;