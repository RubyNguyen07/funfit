var Noti = require('../models/Noti'); 
var { CourierClient } = require("@trycourier/courier");
var courier = CourierClient({ authorizationToken: "pk_prod_51873YPK60MQAZGAF4QJJYQWQ1TB" });

exports.getAllNotis = async (req, res) => {
    try {
        const { id } = req.user; 
        const  all = await Noti.find({userId: id}); 
        res.status(200).send(all); 
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getNoti = async (req, res) => {
    try {
        const { id } = req.query; 
        const noti = await Noti.findById(id); 
        if (!noti) {
            return res.status(400).send("No notification found");
        }
        return res.status(200).send(noti); 
    } catch (err) {
        res.status(500).send(err.message); 
    }
}

exports.deleteNoti = async (req, res) => {
    try {
        const { id } = req.body; 
        const noti = await Noti.findByIdAndDelete(id); 
        return res.status(204).send('Notification is deleted'); 
    } catch (err) {
        res.status(500).send(err.message);       
    }
}

exports.sendANoti = async (req, res) => {
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
            return res.status(400).send(err.message); 
        }

        return res.status(201).send("Noti is sent"); 
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

