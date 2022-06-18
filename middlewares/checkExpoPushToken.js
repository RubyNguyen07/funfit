const { Expo } = require("expo-server-sdk");

exports.checkPushToken = async (req, res, next) => {
	try {
		if (!Expo.isExpoPushToken(req.body.pushToken)) {
			throw Error('Invalid Expo push token');
		}
	
		next(); 
	} catch (err) {
		throw Error(err.message); 
	}
};
