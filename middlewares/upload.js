const util = require("util");
const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage");

var storage = new GridFsStorage({
	url: process.env.DB_URL,
	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: (req, file) => {
		// const match = ["image/png", "image/jpeg"];
		// if (match.indexOf(file.mimetype) === -1) {
		// 	throw new Error("File not in correct form"); 
		// }
		return {
			bucketName: process.env.BUCKET,
			filename: req.user.id
		};
	}
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;