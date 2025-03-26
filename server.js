const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({ origin: 'https://littleflockweb.vercel.app' })); // Allow requests from frontend
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
mongoose.connect('mongodb+srv://littleflockprayerfellowshipweb:flock123@littleflockweb.7aaya.mongodb.net/littleflockweb?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define Mongoose Schema
const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true }, // Unique identifier for each video
  likes: { type: Number, default: 0 },
  comments: [
    {
      username: { type: String, required: true },
      comment: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Mongoose Model
const Video = mongoose.model('Video', videoSchema);

// Route to add a comment
app.post('/api/comments', async (req, res) => {
  const { videoId, username, comment } = req.body;

  if (!videoId || !username || !comment) {
    return res.status(400).json({ error: 'Missing required fields!' });
  }

  try {
    let video = await Video.findOne({ videoId });
    if (!video) {
      video = new Video({ videoId });
    }
    video.comments.push({ username, comment });
    await video.save();

    res.json({ message: 'Comment added successfully!', comments: video.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
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
    console.error('Error retrieving comments:', error);
    res.status(500).json({ error: 'Failed to retrieve comments!' });
  }
});

// Route to add a like
app.post('/api/likes', async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId!' });
  }

  try {
    let video = await Video.findOne({ videoId });
    if (!video) {
      video = new Video({ videoId }); // Create a new video document if not found
    }
    video.likes += 1; // Increment likes
    await video.save();

    res.json({ message: 'Like added successfully!', likes: video.likes });
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ error: 'Failed to add like!' });
  }
});

// Route to get likes for a video
app.get('/api/likes/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    let video = await Video.findOne({ videoId });
    if (!video) {
      // If video does not exist, initialize with 0 likes
      video = new Video({ videoId, likes: 0 });
      await video.save(); // Save the new video to the database
    }
    res.json({ likes: video.likes });
  } catch (error) {
    console.error('Error retrieving likes:', error);
    res.status(500).json({ error: 'Failed to retrieve likes!' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
