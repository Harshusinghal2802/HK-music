const Song = require("../models/Song");
const User = require("../models/User");
const { uploadToCloudinary, cloudinary } = require("../config/cloudinary");

const getSongs = async (req, res) => {
  try {
    const { search, genre, album, artist } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
        { album: { $regex: search, $options: "i" } },
      ];
    }
    if (genre) query.genre = genre;
    if (album) query.album = album;
    if (artist) query.artist = artist;

    const songs = await Song.find(query).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlbums = async (req, res) => {
  try {
    const albums = await Song.aggregate([
      {
        $group: {
          _id: "$album",
          coverImage: { $first: "$coverImage" },
          artist: { $first: "$artist" },
          songCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArtists = async (req, res) => {
  try {
    const artists = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          coverImage: { $first: "$coverImage" },
          songCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    if (!req.files || !req.files.audio || !req.files.cover) {
      return res.status(400).json({ message: "Please upload both audio and cover image" });
    }

    const audioFile = req.files.audio[0];
    const coverFile = req.files.cover[0];

    const audioResult = await uploadToCloudinary(audioFile.buffer, "hkmusic/audio", "video");
    const coverResult = await uploadToCloudinary(coverFile.buffer, "hkmusic/covers", "image");

    const song = await Song.create({
      title,
      artist,
      album: album || "Single",
      genre: genre || "",
      duration: duration || 0,
      coverImage: coverResult.secure_url,
      coverImagePublicId: coverResult.public_id,
      audioUrl: audioResult.secure_url,
      audioPublicId: audioResult.public_id,
      uploadedBy: req.user._id,
    });

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    const { title, artist, album, genre, duration } = req.body;

    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (album) song.album = album;
    if (genre) song.genre = genre;
    if (duration) song.duration = duration;

    if (req.files && req.files.cover) {
      const coverResult = await uploadToCloudinary(req.files.cover[0].buffer, "hkmusic/covers", "image");
      song.coverImage = coverResult.secure_url;
      song.coverImagePublicId = coverResult.public_id;
    }

    if (req.files && req.files.audio) {
      const audioResult = await uploadToCloudinary(req.files.audio[0].buffer, "hkmusic/audio", "video");
      song.audioUrl = audioResult.secure_url;
      song.audioPublicId = audioResult.public_id;
    }

    const updatedSong = await song.save();
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    if (song.audioPublicId) {
      await cloudinary.uploader.destroy(song.audioPublicId, { resource_type: "video" });
    }
    if (song.coverImagePublicId) {
      await cloudinary.uploader.destroy(song.coverImagePublicId, { resource_type: "image" });
    }

    await song.deleteOne();
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const incrementPlay = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    if (!song) return res.status(404).json({ message: "Song not found" });

    const user = await User.findById(req.user._id);
    user.recentlyPlayed = user.recentlyPlayed.filter(
      (item) => item.song.toString() !== req.params.id
    );
    user.recentlyPlayed.unshift({ song: req.params.id, playedAt: new Date() });
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 30);
    await user.save();

    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const songId = req.params.id;

    const index = user.favorites.findIndex((id) => id.toString() === songId);
    let isFavorite;

    if (index > -1) {
      user.favorites.splice(index, 1);
      isFavorite = false;
    } else {
      user.favorites.push(songId);
      isFavorite = true;
    }

    await user.save();
    res.json({ isFavorite, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentlyPlayed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("recentlyPlayed.song");
    const recent = user.recentlyPlayed
      .filter((item) => item.song)
      .map((item) => ({ ...item.song.toObject(), playedAt: item.playedAt }));
    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalUsers = await User.countDocuments();
    const topSongs = await Song.find().sort({ plays: -1 }).limit(5);
    const totalPlaysAgg = await Song.aggregate([
      { $group: { _id: null, total: { $sum: "$plays" } } },
    ]);
    const totalPlays = totalPlaysAgg[0] ? totalPlaysAgg[0].total : 0;

    res.json({ totalSongs, totalUsers, totalPlays, topSongs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSongs,
  getSongById,
  getAlbums,
  getArtists,
  uploadSong,
  updateSong,
  deleteSong,
  incrementPlay,
  toggleFavorite,
  getFavorites,
  getRecentlyPlayed,
  getStats,
};
