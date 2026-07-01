const express = require("express");
const router = express.Router();
const {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  renamePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require("../controllers/playlistController");
const protect = require("../middleware/auth");

router.get("/", protect, getPlaylists);
router.get("/:id", protect, getPlaylistById);
router.post("/", protect, createPlaylist);
router.put("/:id", protect, renamePlaylist);
router.delete("/:id", protect, deletePlaylist);
router.post("/:id/songs", protect, addSongToPlaylist);
router.delete("/:id/songs/:songId", protect, removeSongFromPlaylist);

module.exports = router;
