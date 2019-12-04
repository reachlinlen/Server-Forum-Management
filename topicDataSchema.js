let mongoose = require('mongoose')

let topicDataSchema = new mongoose.Schema({
  "topic_id": {
    type: String,
    required: true,
    unique: true
  },  
  "subject": {
    type: String,
    required: true,
  },
  "topic_content": {
    type: String,
    // required: true,
  },
  "comments": {
    type: Array,
  },
  },
  { collection: 'topic_data' });

module.exports = mongoose.model("TopicData", topicDataSchema)