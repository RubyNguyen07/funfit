var mongoose = require('mongoose'); 

var db_url = "mongodb+srv://admin:12345@cluster0.ari3y.gcp.mongodb.net/?retryWrites=true&w=majority"

var InitiateMongoServer = async () => {
    try {
        await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("Database connected!"))
    } catch (e) {
        console.log(e); 
        throw e; 
    }
}

module.exports = InitiateMongoServer; 
