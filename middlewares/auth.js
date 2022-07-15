var jwt = require('jsonwebtoken');

// Check if input token is valid 
exports.auth = (req, res, next) => {
    var token = req.headers.authorization.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({message: "Auth err"}); 
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user; 
        next(); 
    } catch (e) {
        console.error(e); 
        res.status(500).json({message: "Invalid token"}); 
    }
}; 