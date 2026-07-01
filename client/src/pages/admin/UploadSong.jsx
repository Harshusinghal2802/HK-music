import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import api from "../../api/axios";

const UploadSong = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const getAudioDuration = (file) => {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        resolve(Math.round(audio.duration));
        URL.revokeObjectURL(audio.src);
      };
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile || !coverFile) {
      setMessage("Please select both an audio file and a cover image");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const duration = await getAudioDuration(audioFile);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("album", album);
      formData.append("genre", genre);
      formData.append("duration", duration);
      formData.append("audio", audioFile);
      formData.append("cover", coverFile);

      await api.post("/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Song uploaded successfully!");
      setTimeout(() => navigate("/admin/songs"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Upload Song</h1>

      {message && (
        <div className="bg-primary/20 text-primary text-sm px-4 py-2 rounded-lg mb-4">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary"
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary"
        />
        <input
          type="text"
          placeholder="Album (optional)"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary"
        />
        <input
          type="text"
          placeholder="Genre (optional)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary"
        />

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            required
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary/20 file:text-primary"
          />
          {coverPreview && (
            <img src={coverPreview} alt="preview" className="w-24 h-24 object-cover rounded-lg mt-3" />
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary/20 file:text-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary text-dark font-semibold py-3 rounded-full disabled:opacity-60"
        >
          <FiUploadCloud /> {loading ? "Uploading..." : "Upload Song"}
        </button>
      </form>
    </div>
  );
};

export default UploadSong;
