const express = require('express');
const Playlist = require('../models/Playlist');
const { protect } = require('../middleware/auth');

const router = express.Router();

// helper: check ownership (admins may manage any playlist, users only their own)
const canManage = (playlist, user) => {
  return user.role === 'admin' || playlist.owner.toString() === user._id.toString();
};

// GET /api/playlists -> get current user's playlists (admins see all)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const playlists = await Playlist.find(filter)
      .populate('songs')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/playlists/:id -> get single playlist with songs
router.get('/:id', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (!canManage(playlist, req.user)) {
      return res.status(403).json({ message: 'Not authorized to view this playlist' });
    }
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/playlists -> create playlist
router.post('/', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    const playlist = await Playlist.create({ name: name.trim(), owner: req.user._id, songs: [] });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/playlists/:id -> rename playlist
router.put('/:id', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (!canManage(playlist, req.user)) {
      return res.status(403).json({ message: 'Not authorized to edit this playlist' });
    }
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    playlist.name = name.trim();
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/playlists/:id -> delete playlist
router.delete('/:id', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (!canManage(playlist, req.user)) {
      return res.status(403).json({ message: 'Not authorized to delete this playlist' });
    }
    await playlist.deleteOne();
    res.json({ message: 'Playlist deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/playlists/:id/songs -> add song to playlist
router.post('/:id/songs', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (!canManage(playlist, req.user)) {
      return res.status(403).json({ message: 'Not authorized to edit this playlist' });
    }
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ message: 'songId is required' });
    if (!playlist.songs.some((s) => s.toString() === songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    const updated = await Playlist.findById(playlist._id).populate('songs');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/playlists/:id/songs/:songId -> remove song from playlist
router.delete('/:id/songs/:songId', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (!canManage(playlist, req.user)) {
      return res.status(403).json({ message: 'Not authorized to edit this playlist' });
    }
    playlist.songs = playlist.songs.filter((s) => s.toString() !== req.params.songId);
    await playlist.save();
    const updated = await Playlist.findById(playlist._id).populate('songs');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
