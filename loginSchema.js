let mongoose = require('mongoose')

let loginSchema = new mongoose.Schema({
    "id": {
        type: String,
        required: true,
        unique: true
    },
    "password": {
        type: String,
        required: true,
    },
},
{ collection: 'login' });

module.exports = mongoose.model("Login", loginSchema)