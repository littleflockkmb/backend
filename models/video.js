const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: String,
  likes: { type: Number, default: 0 },
  comments: [
    {
      username: String,
      comment: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Video', videoSchema);
