const Playlist = require("../models/Playlist");

const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id }).populate("songs");
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("songs");

    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Playlist name is required" });

    const playlist = await Playlist.create({
      name,
      user: req.user._id,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const renamePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.name = req.body.name || playlist.name;
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    const { songId } = req.body;
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    const updated = await Playlist.findById(playlist._id).populate("songs");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs = playlist.songs.filter(
      (songId) => songId.toString() !== req.params.songId
    );
    await playlist.save();

    const updated = await Playlist.findById(playlist._id).populate("songs");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  renamePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
