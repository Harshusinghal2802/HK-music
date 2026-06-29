const express = require('express');
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/songs?search=&artist=&genre= -> list songs (all logged-in users)
router.get('/', protect, async (req, res) => {
  try {
    const { search, artist, genre } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
      ];
    }
    if (artist) filter.artist = artist;
    if (genre) filter.genre = genre;
    const songs = await Song.find(filter).sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/songs/meta/filters -> distinct artists and genres for filter dropdowns
router.get('/meta/filters', protect, async (req, res) => {
  try {
    const artists = await Song.distinct('artist');
    const genres = await Song.distinct('genre');
    res.json({ artists, genres });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/songs -> admin uploads a new song (audio + cover)
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { title, artist, genre, duration } = req.body;
      if (!title || !artist || !genre) {
        return res.status(400).json({ message: 'Title, artist and genre are required' });
      }
      if (!req.files || !req.files.audio) {
        return res.status(400).json({ message: 'Audio file is required' });
      }
      const audioUrl = `/uploads/songs/${req.files.audio[0].filename}`;
      const coverUrl = req.files.cover ? `/uploads/covers/${req.files.cover[0].filename}` : '';

      const song = await Song.create({
        title,
        artist,
        genre,
        audioUrl,
        coverUrl,
        duration: duration ? Number(duration) : 0,
        uploadedBy: req.user._id,
      });
      res.status(201).json(song);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// PUT /api/songs/:id -> admin edits song (optionally replace audio/cover)
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  async (req, res) => {
    try {
      const song = await Song.findById(req.params.id);
      if (!song) return res.status(404).json({ message: 'Song not found' });

      const { title, artist, genre, duration } = req.body;
      if (title) song.title = title;
      if (artist) song.artist = artist;
      if (genre) song.genre = genre;
      if (duration) song.duration = Number(duration);

      if (req.files && req.files.audio) {
        const oldPath = path.join(__dirname, '..', song.audioUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        song.audioUrl = `/uploads/songs/${req.files.audio[0].filename}`;
      }
      if (req.files && req.files.cover) {
        if (song.coverUrl) {
          const oldCover = path.join(__dirname, '..', song.coverUrl);
          if (fs.existsSync(oldCover)) fs.unlinkSync(oldCover);
        }
        song.coverUrl = `/uploads/covers/${req.files.cover[0].filename}`;
      }

      await song.save();
      res.json(song);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// DELETE /api/songs/:id -> admin deletes song and removes from playlists
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const audioPath = path.join(__dirname, '..', song.audioUrl);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    if (song.coverUrl) {
      const coverPath = path.join(__dirname, '..', song.coverUrl);
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }

    await Playlist.updateMany({}, { $pull: { songs: song._id } });
    await song.deleteOne();
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/songs/:id/play -> record a play in user's recently played list
router.post('/:id/play', protect, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    user.recentlyPlayed = user.recentlyPlayed.filter((s) => s.toString() !== song._id.toString());
    user.recentlyPlayed.unshift(song._id);
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 10);
    await user.save();

    res.json({ message: 'Recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/songs/recent/played -> get current user's recently played songs
router.get('/recent/played', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id).populate('recentlyPlayed');
    res.json(user.recentlyPlayed);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
