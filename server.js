const express = require('express');
const mongoose = require('mongoose');
const Video = require('./models/video'); // Import Video model

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
mongoose.connect('mongodb+srv://littleflockprayerfellowshipweb:<db_password>@littleflockweb.7aaya.mongodb.net/?retryWrites=true&w=majority&appName=littleflockweb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

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
      video = new Video({ videoId });
    }
    video.likes += 1;
    await video.save();

    res.json({ message: 'Like added!', likes: video.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add like!' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
