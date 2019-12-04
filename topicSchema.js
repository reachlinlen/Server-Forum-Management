let mongoose = require('mongoose')

let topicSchema = new mongoose.Schema({
    "subject": {
        type: String,
        required: true,
        // unique: true
    },
    "topic": {
        type: String,
        required: true,
    },
},
{ collection: 'topics' });

module.exports = mongoose.model("Topic", topicSchema)