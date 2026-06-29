const express = require('express');
const Song = require('../models/Song');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/stats/admin -> admin dashboard stats
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const [totalSongs, totalUsers, totalPlaylists] = await Promise.all([
      Song.countDocuments(),
      User.countDocuments(),
      Playlist.countDocuments(),
    ]);
    res.json({ totalSongs, totalUsers, totalPlaylists });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/stats/user -> user dashboard stats (just playlist count, kept minimal)
router.get('/user', protect, async (req, res) => {
  try {
    const myPlaylists = await Playlist.countDocuments({ owner: req.user._id });
    res.json({ myPlaylists });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
