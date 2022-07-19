var util = require("util");
var multer = require('multer');
var { GridFsStorage } = require("multer-gridfs-storage");
var Story = require('../models/Story'); 

// Set up storage to upload story 
var storage = new GridFsStorage({
	url: process.env.DB_URL,
	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: async (req, file) => {
		const name = req.user.id + '' + new Date().getTime();

		try  {
			await new Story({
				userId: req.user.id, 
				filename: name, 
				contentType: file.mimetype,
				expiredAt: new Date()
			}).save();	
		} catch (err) {
			throw new Error("Unable to save story");
		}

		return {
			bucketName: process.env.STORY_BUCKET,
			filename: name
		};
	}
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;