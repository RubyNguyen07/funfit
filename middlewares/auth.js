var jwt = require('jsonwebtoken');
var config = require('../config/auth.config');

exports.auth = (req, res, next) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({message: "Auth err"}); 
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        req.user = decoded.user; 
        next(); 
    } catch (e) {
        console.error(e); 
        res.status(500).json({message: "Invalid token"}); 
    }
}; 