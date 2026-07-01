import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiList, FiTrash2, FiEdit2 } from "react-icons/fi";
import api from "../api/axios";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchPlaylists = async () => {
    try {
      const { data } = await api.get("/playlists");
      setPlaylists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const { data } = await api.post("/playlists", { name: newName });
      setPlaylists([...playlists, data]);
      setNewName("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePlaylist = async (id) => {
    if (!window.confirm("Delete this playlist?")) return;
    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists(playlists.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startRename = (playlist) => {
    setEditingId(playlist._id);
    setEditName(playlist.name);
  };

  const submitRename = async (id) => {
    try {
      const { data } = await api.put(`/playlists/${id}`, { name: editName });
      setPlaylists(playlists.map((p) => (p._id === id ? data : p)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-400">Loading playlists...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Playlists</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-dark font-semibold px-4 py-2 rounded-full text-sm"
        >
          <FiPlus /> New Playlist
        </button>
      </div>

      {showForm && (
        <form onSubmit={createPlaylist} className="flex gap-2 mb-6 max-w-md">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Playlist name"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-primary"
            autoFocus
          />
          <button type="submit" className="bg-primary text-dark font-semibold px-4 py-2 rounded-lg">
            Create
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className="text-gray-400">You haven't created any playlists yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="glass rounded-xl p-3 group relative">
              <Link to={`/playlists/${playlist._id}`}>
                <div className="w-full aspect-square bg-white/5 rounded-lg mb-3 flex items-center justify-center">
                  <FiList className="text-3xl text-gray-500" />
                </div>
                {editingId === playlist._id ? null : (
                  <p className="text-sm font-semibold truncate">{playlist.name}</p>
                )}
                <p className="text-xs text-gray-400">{playlist.songs.length} songs</p>
              </Link>

              {editingId === playlist._id ? (
                <div className="flex gap-1 mt-1">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-white/10 rounded px-2 py-1 text-xs outline-none"
                  />
                  <button
                    onClick={() => submitRename(playlist._id)}
                    className="text-xs bg-primary text-dark px-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => startRename(playlist)} className="text-gray-400 hover:text-white text-xs flex items-center gap-1">
                    <FiEdit2 /> Rename
                  </button>
                  <button onClick={() => deletePlaylist(playlist._id)} className="text-gray-400 hover:text-red-400 text-xs flex items-center gap-1">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
