const Playlist = require("../models/Playlist");

const getPlaylists = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
    const playlists = await Playlist.find(filter)
      .populate("songs")
      .populate("owner", "name");
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const playlist = await Playlist.create({ name, owner: req.user._id });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role !== "admin" &&
      playlist.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (req.body.name) playlist.name = req.body.name;
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role !== "admin" &&
      playlist.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await playlist.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role !== "admin" &&
      playlist.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { songId } = req.body;
    if (!playlist.songs.includes(songId)) playlist.songs.push(songId);
    await playlist.save();
    await playlist.populate("songs");
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role !== "admin" &&
      playlist.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    playlist.songs = playlist.songs.filter(
      (s) => s.toString() !== req.params.songId,
    );
    await playlist.save();
    await playlist.populate("songs");
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
};
