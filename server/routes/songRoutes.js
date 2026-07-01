const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/songController");
const protect = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

router.get("/", getSongs);
router.get("/albums", getAlbums);
router.get("/artists", getArtists);
router.get("/favorites", protect, getFavorites);
router.get("/recently-played", protect, getRecentlyPlayed);
router.get("/stats", protect, admin, getStats);
router.get("/:id", getSongById);

router.post(
  "/",
  protect,
  admin,
  upload.fields([{ name: "audio", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  uploadSong
);
router.put(
  "/:id",
  protect,
  admin,
  upload.fields([{ name: "audio", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  updateSong
);
router.delete("/:id", protect, admin, deleteSong);

router.post("/:id/play", protect, incrementPlay);
router.post("/:id/favorite", protect, toggleFavorite);

module.exports = router;
