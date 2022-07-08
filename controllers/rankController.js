var User = require('../models/User');

exports.getLevel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // var badge = '';
        // if (level > 0 && level < 6) {
        //     badge =  'Iron'
        // } else if (level > 5 && level < 9) {
        //     badge =  'Bronze'
        // } else if (level > 8 && level < 12) {
        //     badge =  'Silver'
        // } else if (level > 11 && level < 12) {
        //     badge =  'Silver'
        // }
        res.status(200).send({
            level: user.level, 
            points: user.points
        })
    } catch (err) {
        res.status(500).send(err.message);
    }
}