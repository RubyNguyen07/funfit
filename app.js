var express = require('express'); 
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser'); 
var helmet = require("helmet"); 
var cors = require('cors'); 
require('dotenv').config(); 
var InitiateMongoServer = require('./config/db'); 

var user = require('./routes/users'); 
var routine = require('./routes/routines'); 
var homeController = require('./controllers/homeController'); 

InitiateMongoServer();

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(helmet());
app.use(cors()); 

app.use('/user', user); 
app.use('/routine', routine); 

// app.get('/', (req, res) => {
//     res.status(200); 
//     res.send("Welcome, Ruby"); 
// })

// var utilss = require('./utils/friendsRecommender'); 
// utilss.findNeighbors("6291de8d0c29404a0e5c1502"); 

app.get('/user', homeController.getHome); 

app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running and listening on port: " + port); 
    } else {
        console.log("Error: " + err); 
    }
})


