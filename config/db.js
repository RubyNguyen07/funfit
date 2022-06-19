var mongoose = require('mongoose'); 
var db_url = process.env.DB_URL;

var InitiateMongoServer =  async () => {
    try {
        await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Database connected"); 
        })
    } catch (e) {
        console.log(e); 
        throw e; 
    }
}

module.exports = InitiateMongoServer; 
