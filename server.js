/*const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'https://littleflockweb.vercel.app' })); // Allow requests from the frontend
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(
    'mongodb+srv://littleflockprayerfellowshipweb:flock123@littleflockweb.7aaya.mongodb.net/littleflockweb?retryWrites=true&w=majority'
)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Schema and Models

// Score Schema for Leaderboard
const ScoreSchema = new mongoose.Schema({
    username: { type: String, required: true },
    score: { type: Number, required: true },
    game: { type: String, required: true }, // Game identifier
});

const Score = mongoose.model('Score', ScoreSchema);

// Video Schema for Likes and Comments
const videoSchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true }, // Unique video identifier
    likes: { type: Number, default: 0 },
    comments: [
        {
            username: { type: String, required: true },
            comment: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

const Video = mongoose.model('Video', videoSchema);

// Routes

// Save Score
app.post('/save-score', async (req, res) => {
    const { username, score, game } = req.body;

    if (!username || !score || !game) {
        return res.status(400).json({ error: 'Missing required fields!' });
    }

    try {
        const newScore = new Score({ username, score, game });
        await newScore.save();
        res.status(200).json({ message: 'Score saved successfully!' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score!' });
    }
});

// Get Leaderboard
app.get('/leaderboard', async (req, res) => {
    const { game } = req.query;

    if (!game) {
        return res.status(400).json({ error: 'Missing required game query!' });
    }

    try {
        const scores = await Score.find({ game }).sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard!' });
    }
});

// Add a Comment
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

// Get Comments
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

// Add a Like
app.post('/api/likes', async (req, res) => {
    const { videoId } = req.body;

    if (!videoId) {
        return res.status(400).json({ error: 'Missing videoId!' });
    }

    try {
        let video = await Video.findOne({ videoId });
        if (!video) {
            video = new Video({ videoId }); // Create a new video if not found
        }
        video.likes += 1;
        await video.save();

        res.json({ message: 'Like added successfully!', likes: video.likes });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Failed to add like!' });
    }
});

// Get Likes
app.get('/api/likes/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
        let video = await Video.findOne({ videoId });
        if (!video) {
            video = new Video({ videoId, likes: 0 }); // Create a new video with 0 likes
            await video.save();
        }
        res.json({ likes: video.likes });
    } catch (error) {
        console.error('Error retrieving likes:', error);
        res.status(500).json({ error: 'Failed to retrieve likes!' });
    }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
*/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors({ origin: 'https://vbscom.onrender.com' })); // Allow frontend requests
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(
    'mongodb+srv://littleflockprayerfellowshipweb:flock123@littleflockweb.7aaya.mongodb.net/littleflockweb?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Schemas

// Schema to store usernames
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

// Schema to store scores for games
const ScoreSchema = new mongoose.Schema({
    username: { type: String, required: true },
    score: { type: Number, required: true },
    game: { type: String, required: true },
});

// Schema to store likes and comments for videos
const VideoSchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true },
    likes: { type: Number, default: 0 },
    comments: [
        {
            username: { type: String, required: true },
            comment: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    likedUsers: [String], // Track users who liked the video
});

// Models
const User = mongoose.model('User', UserSchema);
const Score = mongoose.model('Score', ScoreSchema);
const Video = mongoose.model('Video', VideoSchema);

// Routes

// Save Username
app.post('/api/save-username', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required!' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists!' });
        }

        const newUser = new User({ username });
        await newUser.save();
        res.status(201).json({ message: 'Username saved successfully!' });
    } catch (error) {
        console.error('Error saving username:', error);
        res.status(500).json({ error: 'Failed to save username!' });
    }
});

// Save Score
app.post('/save-score', async (req, res) => {
    const { username, score, game } = req.body;

    if (!username || !score || !game) {
        return res.status(400).json({ error: 'Missing required fields!' });
    }

    try {
        const newScore = new Score({ username, score, game });
        await newScore.save();
        res.status(200).json({ message: 'Score saved successfully!' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score!' });
    }
});

// Get Leaderboard
app.get('/leaderboard', async (req, res) => {
    const { game } = req.query;

    if (!game) {
        return res.status(400).json({ error: 'Missing required game query!' });
    }

    try {
        const scores = await Score.find({ game }).sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard!' });
    }
});

// Add a Like
app.post('/api/likes', async (req, res) => {
    const { videoId, username } = req.body;

    if (!videoId || !username) {
        return res.status(400).json({ error: 'Missing required fields!' });
    }

    try {
        let video = await Video.findOne({ videoId });
        if (!video) {
            video = new Video({ videoId, likes: 0, comments: [], likedUsers: [] });
        }

        if (video.likedUsers.includes(username)) {
            return res.status(400).json({ error: 'User has already liked this video!' });
        }

        video.likes += 1;
        video.likedUsers.push(username);
        await video.save();

        res.json({ message: 'Like added successfully!', likes: video.likes });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Failed to add like!' });
    }
});

// Get Likes
app.get('/api/likes/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
        let video = await Video.findOne({ videoId });
        if (!video) {
            video = new Video({ videoId, likes: 0, comments: [], likedUsers: [] });
            await video.save();
        }

        res.json({ likes: video.likes });
    } catch (error) {
        console.error('Error retrieving likes:', error);
        res.status(500).json({ error: 'Failed to retrieve likes!' });
    }
});

// Add a Comment
app.post('/api/comments', async (req, res) => {
    const { videoId, username, comment } = req.body;

    if (!videoId || !username || !comment) {
        return res.status(400).json({ error: 'Missing required fields!' });
    }

    try {
        let video = await Video.findOne({ videoId });
        if (!video) {
            video = new Video({ videoId, likes: 0, comments: [], likedUsers: [] });
        }

        video.comments.push({ username, comment });
        await video.save();

        res.json({ message: 'Comment added successfully!', comments: video.comments });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment!' });
    }
});

// Get Comments
app.get('/api/comments/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
        const video = await Video.findOne({ videoId });
        if (!video) {
            return res.status(404).json({ error: 'Video not found!' });
        }

        res.json({ comments: video.comments });
    } catch (error) {
        console.error('Error retrieving comments:', error);
        res.status(500).json({ error: 'Failed to retrieve comments!' });
    }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
