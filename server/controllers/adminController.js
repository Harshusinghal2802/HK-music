const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

const getStats = async (req, res) => {
  try {
    const [users, songs, playlists] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Playlist.countDocuments(),
    ]);
    res.json({ users, songs, playlists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getUsers };
