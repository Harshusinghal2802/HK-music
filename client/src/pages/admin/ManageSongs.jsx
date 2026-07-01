import { useEffect, useState } from "react";
import { FiTrash2, FiEdit2, FiX, FiCheck } from "react-icons/fi";
import api from "../../api/axios";

const ManageSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", artist: "", album: "", genre: "" });

  const fetchSongs = async () => {
    try {
      const { data } = await api.get("/songs");
      setSongs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const deleteSong = async (id) => {
    if (!window.confirm("Delete this song permanently?")) return;
    try {
      await api.delete(`/songs/${id}`);
      setSongs(songs.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (song) => {
    setEditingId(song._id);
    setEditData({ title: song.title, artist: song.artist, album: song.album, genre: song.genre });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await api.put(`/songs/${id}`, editData);
      setSongs(songs.map((s) => (s._id === id ? data : s)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-400">Loading songs...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Songs</h1>

      {songs.length === 0 ? (
        <p className="text-gray-400">No songs uploaded yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {songs.map((song) => (
            <div key={song._id} className="glass rounded-lg px-4 py-3">
              {editingId === song._id ? (
                <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Title"
                    className="bg-white/10 rounded px-3 py-2 text-sm flex-1 outline-none"
                  />
                  <input
                    value={editData.artist}
                    onChange={(e) => setEditData({ ...editData, artist: e.target.value })}
                    placeholder="Artist"
                    className="bg-white/10 rounded px-3 py-2 text-sm flex-1 outline-none"
                  />
                  <input
                    value={editData.album}
                    onChange={(e) => setEditData({ ...editData, album: e.target.value })}
                    placeholder="Album"
                    className="bg-white/10 rounded px-3 py-2 text-sm flex-1 outline-none"
                  />
                  <input
                    value={editData.genre}
                    onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
                    placeholder="Genre"
                    className="bg-white/10 rounded px-3 py-2 text-sm flex-1 outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => saveEdit(song._id)} className="text-primary p-2">
                      <FiCheck />
                    </button>
                    <button onClick={cancelEdit} className="text-gray-400 p-2">
                      <FiX />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {song.artist} · {song.album} · {song.plays} plays
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => startEdit(song)} className="text-gray-300 hover:text-white">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => deleteSong(song._id)} className="text-gray-300 hover:text-red-400">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSongs;
