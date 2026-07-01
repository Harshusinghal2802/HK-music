import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlay, FiTrash2, FiList } from "react-icons/fi";
import api from "../api/axios";
import { usePlayer } from "../context/PlayerContext";

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [showAddSong, setShowAddSong] = useState(false);
  const { playSong } = usePlayer();

  const fetchPlaylist = async () => {
    try {
      const { data } = await api.get(`/playlists/${id}`);
      setPlaylist(data);
    } catch (err) {
      console.error(err);
      navigate("/playlists");
    }
  };

  useEffect(() => {
    fetchPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAllSongs = async () => {
    try {
      const { data } = await api.get("/songs");
      setAllSongs(data);
      setShowAddSong(true);
    } catch (err) {
      console.error(err);
    }
  };

  const addSong = async (songId) => {
    try {
      const { data } = await api.post(`/playlists/${id}/songs`, { songId });
      setPlaylist(data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeSong = async (songId) => {
    try {
      const { data } = await api.delete(`/playlists/${id}/songs/${songId}`);
      setPlaylist(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!playlist) return <div className="text-gray-400">Loading playlist...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
          <FiList className="text-3xl text-gray-500" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">Playlist</p>
          <h1 className="text-2xl font-bold">{playlist.name}</h1>
          <p className="text-sm text-gray-400">{playlist.songs.length} songs</p>
        </div>
      </div>

      <button
        onClick={loadAllSongs}
        className="bg-primary text-dark font-semibold px-4 py-2 rounded-full text-sm mb-6"
      >
        Add Songs
      </button>

      {showAddSong && (
        <div className="glass rounded-xl p-4 mb-6 max-h-72 overflow-y-auto">
          <p className="text-sm font-semibold mb-3">Select a song to add</p>
          {allSongs.map((song) => (
            <div
              key={song._id}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-sm truncate">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
              </div>
              <button
                onClick={() => addSong(song._id)}
                className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full flex-shrink-0"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {playlist.songs.length === 0 ? (
        <p className="text-gray-400">No songs in this playlist yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {playlist.songs.map((song) => (
            <div
              key={song._id}
              className="flex items-center justify-between glass rounded-lg px-4 py-3 hover:bg-white/10 transition"
            >
              <div
                onClick={() => playSong(song, playlist.songs)}
                className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
              >
                <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => playSong(song, playlist.songs)} className="text-gray-300 hover:text-white">
                  <FiPlay />
                </button>
                <button onClick={() => removeSong(song._id)} className="text-gray-300 hover:text-red-400">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
