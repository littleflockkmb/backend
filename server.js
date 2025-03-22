const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({ origin: 'https://vbs-pink.vercel.app' })); // Allow requests from frontend
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
mongoose.connect('your-mongodb-connection-string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define Mongoose Schema
const videoSchema = new mongoose.Schema({
  videoId: String, // Unique identifier for each video
  likes: { type: Number, default: 0 },
  comments: [
    {
      username: String,
      comment: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Mongoose Model
const Video = mongoose.model('Video', videoSchema);

// Route to add a comment
app.post('/api/comments', async (req, res) => {
  const { videoId, username, comment } = req.body;

  try {
    let video = await Video.findOne({ videoId });
    if (!video) {
      video = new Video({ videoId });
    }
    video.comments.push({ username, comment });
    await video.save();

    res.json({ message: 'Comment added successfully!', comments: video.comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment!' });
  }
});

// Route to get comments
app.get('/api/comments/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findOne({ videoId });
    if (video) {
      res.json({ comments: video.comments });
    } else {
      res.status(404).json({ message: 'Video not found!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve comments!' });
  }
});

// Route to add a like
app.post('/api/likes', async (req, res) => {
  const { videoId } = req.body;

  try {
    let video = await Video.findOne({ videoId });
    if (!video) {
      video = new Video({ videoId }); // Create a new video document if not found
    }
    video.likes += 1; // Increment likes
    await video.save();

    res.json({ message: 'Like added!', likes: video.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add like!' });
  }
});

// Route to get likes for a video
app.get('/api/likes/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findOne({ videoId });
    if (video) {
      res.json({ likes: video.likes }); // Send the current like count
    } else {
      res.status(404).json({ message: 'Video not found!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve likes!' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
