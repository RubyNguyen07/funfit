var util = require("util");
var multer = require('multer');
var { GridFsStorage } = require("multer-gridfs-storage");
var Story = require('../models/Story'); 

var storage = new GridFsStorage({
	url: process.env.DB_URL,
	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: async (req, file) => {
		const name = req.user.id + ' ' + new Date();

		await new Story({
			userId: req.user.id, 
			filename: name, 
			contentType: file.mimetype
		}).save();

		return {
			bucketName: process.env.STORY_BUCKET,
			filename: name
		};
	}
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;