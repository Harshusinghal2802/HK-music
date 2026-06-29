const Song = require("../models/Song");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const getSongs = async (req, res) => {
  try {
    const { search, genre, artist } = req.query;
    const filter = {};
    if (search)
      filter.$or = [
        { title: new RegExp(search, "i") },
        { artist: new RegExp(search, "i") },
        { album: new RegExp(search, "i") },
      ];
    if (genre) filter.genre = new RegExp(genre, "i");
    if (artist) filter.artist = new RegExp(artist, "i");
    const songs = await Song.find(filter).sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;
    if (!title || !artist)
      return res.status(400).json({ message: "Title and artist required" });
    const filePath = req.files?.song
      ? `/uploads/songs/${req.files.song[0].filename}`
      : req.body.filePath;
    const coverPath = req.files?.cover
      ? `/uploads/covers/${req.files.cover[0].filename}`
      : req.body.coverPath || "";
    if (!filePath)
      return res.status(400).json({ message: "Song file required" });
    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration: Number(duration) || 0,
      filePath,
      coverPath,
      uploadedBy: req.user._id,
    });
    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    const tryDelete = (p) => {
      try {
        if (p && !p.startsWith("http"))
          fs.unlinkSync(path.join(__dirname, "..", p));
      } catch {}
    };
    tryDelete(song.filePath);
    tryDelete(song.coverPath);
    res.json({ message: "Song deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const recordPlay = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyPlayed: req.params.id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        recentlyPlayed: { $each: [req.params.id], $position: 0, $slice: 20 },
      },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFilters = async (req, res) => {
  try {
    const genres = await Song.distinct("genre");
    const artists = await Song.distinct("artist");
    res.json({ genres, artists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSongs,
  getSong,
  addSong,
  updateSong,
  deleteSong,
  recordPlay,
  getFilters,
};
