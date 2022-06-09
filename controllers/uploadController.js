const upload = require("../middlewares/upload");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const url = process.env.DB_URL;
const mongoClient = new MongoClient(url);

exports.uploadFile = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(process.env.DB);
    const images = database.collection(process.env.BUCKET + ".files");
    await images.findOneAndDelete({filename: req.user.id});
    await upload(req, res);
    console.log(req.file);
    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }
    return res.send({
      message: "File has been uploaded.",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
};

exports.getProfilePic = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(process.env.DB);
    const images = database.collection(process.env.BUCKET + ".files");
    const profilePic = images.find({filename: req.user.id});
    if (profilePic == null) {
      return res.status(500).send("No files found!");
    }
    return res.status(200).send({
      fileId: profilePic._id, 
      contentType: profilePic.contentType
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

exports.download = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(process.env.DB);
    const bucket = new GridFSBucket(database, {
      bucketName: process.env.BUCKET,
    });
    let downloadStream = bucket.openDownloadStreamByName(req.body.fileId);
    res.set({
      'Content-Type': req.body.contentType
    })
    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });
    downloadStream.on("error", function (err) {
      return res.status(404).send(err.message);
    });

    downloadStream.pipe(res); 

    // downloadStream.on("end", () => {
    //   return res.end();
    // });
  } catch (error) {
      return res.status(500).send(error.message);
  }
};




// const upload = require('../middlewares/upload');
// const GridFSBucket = require("mongodb").GridFSBucket;
// const url = process.env.DB_URL;
// const baseUrl = "http://localhost:3000/files/";

// const uploadFiles = async (req, res) => {
//   try {
//     await upload(req, res);
//     console.log(req.file);
//     if (req.file == undefined) {
//       return res.send({
//         message: "You must select a file.",
//       });
//     }
//     return res.send({
//       message: "File has been uploaded.",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.send({
//       message: "Error when trying upload image: ${error}",
//     });
//   }
// };

// const getListFiles = async (req, res) => {
//   try {
//     const connection = await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
//     const database = connection.db;
//     const images = database.collection(process.env.BUCKET + ".files");
//     const cursor = images.find({});
//     if (cursor == null) {
//       return res.status(500).send({
//         message: "No files found!",
//       });
//     }
//     let fileInfos = [];
//     await cursor.forEach((doc) => {
//       fileInfos.push({
//         name: doc.filename,
//         url: baseUrl + doc.filename,
//       });
//     });
//     return res.status(200).send(fileInfos);
//   } catch (error) {
//     return res.status(500).send({
//       message: error.message,
//     });
//   }
// };

// const download = async (req, res) => {
//   try {
//     const connection = await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
//     const database = connection.db;
//     const bucket = new GridFSBucket(database, {
//       bucketName: process.env.BUCKET,
//     });
//     let downloadStream = bucket.openDownloadStreamByName(req.params.name);
//     downloadStream.on("data", function (data) {
//       return res.status(200).write(data);
//     });
//     downloadStream.on("error", function (err) {
//       return res.status(404).send({ message: "Cannot download the Image!" });
//     });
//     downloadStream.on("end", () => {
//       return res.end();
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   uploadFiles,
//   getListFiles,
//   download,
// };