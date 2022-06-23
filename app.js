var express = require('express'); 
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser'); 
var helmet = require("helmet"); 
var cors = require('cors'); 
var socket = require('socket.io');
require('dotenv').config(); 
var InitiateMongoServer = require('./config/db');
var { chatConfig } = require('./utils/chat'); 

var user = require('./routes/users'); 
var routine = require('./routes/routines'); 
var homeController = require('./controllers/homeController');

var story = require('./routes/stories');
var noti = require('./routes/notis');
var chat = require('./routes/chats');

let ug = require('ug'); 
let User = require('./models/User'); 
let inputGraph = new ug.Graph();
let helper = require('./utils/friendsRecommender');

InitiateMongoServer().then(async () => {
    await helper.createGraph(inputGraph);
})

exports.graph = inputGraph; 

// InitiateMongoServer().then(async () => {
//     await User.find().cursor().eachAsync(doc => {
//         inputGraph.createNode(doc._id, {email: doc.email});
//     })

//     let run_through = []; 

//     await User.find().cursor().eachAsync((doc) => {
//         if (!(doc._id in run_through)) {        
//             let friends = doc.friends; 
//             let curr = inputGraph.nodes(doc._id).query().first(); 
//             run_through.push(doc._id);
//             for (let i = 0; i < friends.length; i++) {
//                 run_through.push(friends[i]._id);
//                 inputGraph.createEdge('friends').link(curr, inputGraph.nodes(friends[i]._id).query().first()); 
//             }
//         }   
//     })

//     console.log(inputGraph.nodes("6291de8d0c29404a0e5c1502").query().first());

// });

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(helmet());
app.use(cors()); 

app.use('/user', user); 
app.use('/routine', routine); 

app.use('/story', story);
app.use('/noti', noti);
app.use('/chat', chat);

// app.get('/', (req, res) => {
//     res.status(200); 
//     res.send("Welcome, Ruby"); 
// })

// var utilss = require('./utils/friendsRecommender'); 
// utilss.findNeighbors("6291de8d0c29404a0e5c1502"); 

app.get('/story', homeController.getHome); 

var server = app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running and listening on port: " + port); 
    } else {
        console.log("Error: " + err); 
    }
})

var io = socket(server); 
var chatFunfit = io.of('/chatFunfit');
chatConfig(chatFunfit); 
