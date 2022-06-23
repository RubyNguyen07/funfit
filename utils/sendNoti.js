var Noti = require('../models/Noti'); 
var { CourierClient } = require("@trycourier/courier");
var courier = CourierClient({ authorizationToken: "pk_prod_51873YPK60MQAZGAF4QJJYQWQ1TB" });

exports.sendANoti = async (expoPushToken, template, title, message, userName) => {
    try {
        const { expoPushToken, template, title, message, userName } = req.body; 

        const { requestId } = await courier.send({
            message: {
                to: {
                    expo: expoPushToken,
                },
                template: template,
                data: {
                    recipientName: userName,
                },
                content: {
                    title: title, 
                    body: message
                }
            },
        });

        const messageStatus = await courier.getMessage(requestId); 
        if (messageStatus === "error") {
			// Change this log later
            throw Error(err.message); 
        }

		// Change this log later
        console.log("Noti is sent"); 
    } catch (err) {
        throw Error(err.message);
    }
}