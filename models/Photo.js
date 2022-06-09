var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var PhotoSchema = new Schema({
    contentType: {
        type: String, 
        required: true, 
        enum: ["image/jpeg", "image/png"]
    }, 
    desc: {
        type: String, 
        required: true
    }, 
    data: {
        type: Schema.Types.Buffer, 
        required: true 
    }
})

module.exports = mongoose.model('Photo', PhotoSchema); 