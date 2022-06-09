var mongoose = require('mongoose'); 
var db_url = process.env.DB_URL;
var { GridFsBucket } = require('multer-gridfs-storage'); 

var InitiateMongoServer = async () => {
    try {
        let gfs; 
        await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Database connected"); 
        })

        // mongoose.connection.once('open', () => {
        //     gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        //         bucketName: 'photos'
        //     });
        // })
       
    } catch (e) {
        console.log(e); 
        throw e; 
    }
}

module.exports = InitiateMongoServer; 
