var express = require('express'); 
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser'); 
var helmet = require("helmet"); 
require('dotenv').config(); 
var InitiateMongoServer = require('./config/db'); 

var user = require('./routes/users'); 

InitiateMongoServer(); 

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(helmet());

app.use('/user', user); 

app.get('/', (req, res) => {
    res.status(200); 
    res.send("Welcome, Ruby"); 
})

app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running and listening on port: " + port); 
    } else {
        console.log("Error: " + err); 
    }
})
