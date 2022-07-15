const upload = require("../middlewares/upload");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const url = process.env.DB_URL;
const mongoClient = new MongoClient(url);

// Upload profile picture 
exports.uploadFile = async (req, res) => {
	try {
		const { id } = req.user; 
    	await mongoClient.connect();
		const database = mongoClient.db(process.env.DB);
		const images = database.collection(process.env.BUCKET + ".files");
		// Delete old profile picture 
		await images.findOneAndDelete({ filename: id });
		await upload(req, res);
		if (req.file == undefined) {
			return res.status(400).send("You must select a file!");
		}
		return res.status(201).send("File has been uploaded.");
	} catch (err) {
        return res.status(500).send(err.message);
	}
};

// Get information about user's own profile pic 
exports.getProfilePic = async (req, res) => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db(process.env.DB);
		const images = database.collection(process.env.BUCKET + ".files");
		const all = images.find({ filename: req.user.id });

		if (all == null) {
			return res.status(400).send("No files found!");
		}

		let fileInfo = {};
		await all.forEach((doc) => {
			fileInfo = doc;
		});

		return res.status(200).json(fileInfo);
	} catch (err) {
		return res.status(500).send(err.message);
	}
};

// Fetch user's own profile pic 
exports.download = async (req, res) => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db(process.env.DB);
		const bucket = new GridFSBucket(database, {
			bucketName: process.env.BUCKET,
		});

		let downloadStream = bucket.openDownloadStreamByName(req.user.id);

		res.set({
			"Content-Type": req.query.contentType + "",
		});

		downloadStream.on("error", function (err) {
			return res.status(404).send(err.message);
		});

		downloadStream.pipe(res);

	} catch (err) {
		return res.status(500).send(err.message);
	}
};
