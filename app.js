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
var noti = require('./routes/notis');

InitiateMongoServer();

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(helmet());
app.use(cors()); 

app.use('/user', user); 
app.use('/routine', routine); 
app.use('/noti', noti);

// app.get('/', (req, res) => {
//     res.status(200); 
//     res.send("Welcome, Ruby"); 
// })

app.get('/user', homeController.getHome); 

app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running and listening on port: " + port); 
    } else {
        console.log("Error: " + err); 
    }
})


