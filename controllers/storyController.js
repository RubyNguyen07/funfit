var upload = require("../middlewares/storyUpload");
var MongoClient = require("mongodb").MongoClient;
var GridFSBucket = require("mongodb").GridFSBucket;
var url = process.env.DB_URL;
var mongoClient = new MongoClient(url);
var Story = require('../models/Story');
var mongoose = require('mongoose');

exports.uploadFile = async (req, res) => {
	try {
    	await mongoClient.connect();
		await upload(req, res);
		if (req.file == undefined) {
			return res.status(400).send("You must select a picture!");
		}
		return res.status(201).send("Picture has been uploaded.");
	} catch (err) {
        return res.status(500).send(err.message);
	}
};

exports.getStoriesInfo = async (req, res) => {
	try {
        const { id }  = req.query; 

		const stories = await Story.find({ userId: mongoose.Types.ObjectId(id) }, 'filename contentType'); 

		if (stories.length == 0) {
			return res.status(400).send("No pics found!");
		}

		return res.status(200).json(stories);
	} catch (err) {
		return res.status(500).send(err.message);
	}
};

exports.downloadStory = async (req, res) => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db(process.env.DB);
		const bucket = new GridFSBucket(database, {
			bucketName: process.env.STORY_BUCKET,
		});

        // Try downloading by id 
		let downloadStream = bucket.openDownloadStreamByName(req.query.name + "");

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

exports.deleteStory = async (req, res) => {
	try {
		const { storyId } = req.body; 

		const hasDeleted = await Story.findByIdAndDelete(storyId); 

		if (!hasDeleted) {
			return res.status(400).send('Story does not exist');
		}
		
		return res.status(204).send("Story has been deleted");
	} catch (err) {
		res.status(500).send(err.message);
	}
}

