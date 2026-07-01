const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, default: "Single" },
    genre: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    coverImage: { type: String, required: true },
    coverImagePublicId: { type: String },
    audioUrl: { type: String, required: true },
    audioPublicId: { type: String },
    plays: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
