import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

const Library = () => {
  const { playQueue, currentSong, isPlaying } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [filters, setFilters] = useState({ artists: [], genres: [] });

  const [playlists, setPlaylists] = useState([]);
  const [addModalSong, setAddModalSong] = useState(null);
  const [addMessage, setAddMessage] = useState('');

  const fetchFilters = useCallback(async () => {
    try {
      const res = await api.get('/songs/meta/filters');
      setFilters(res.data);
    } catch {
      // non-critical
    }
  }, []);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (artist) params.artist = artist;
      if (genre) params.genre = genre;
      const res = await api.get('/songs', { params });
      setSongs(res.data);
    } catch {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [search, artist, genre]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    const timer = setTimeout(fetchSongs, 300);
    return () => clearTimeout(timer);
  }, [fetchSongs]);

  const handlePlay = (index) => {
    playQueue(songs, index);
  };

  const openAddToPlaylist = async (song) => {
    setAddMessage('');
    setAddModalSong(song);
    try {
      const res = await api.get('/playlists');
      setPlaylists(res.data);
    } catch {
      setPlaylists([]);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await api.post(`/playlists/${playlistId}/songs`, { songId: addModalSong._id });
      setAddMessage('Added to playlist!');
    } catch (err) {
      setAddMessage(err.response?.data?.message || 'Could not add song');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-1">Library</h1>
      <p className="text-white/50 text-sm mb-6">Browse, search, and play every song.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or artist..."
          className="flex-1 px-4 py-2.5 rounded-lg input-glass"
        />
        <select
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="px-4 py-2.5 rounded-lg input-glass sm:w-44"
        >
          <option value="">All Artists</option>
          {filters.artists.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-4 py-2.5 rounded-lg input-glass sm:w-44"
        >
          <option value="">All Genres</option>
          {filters.genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading songs..." />
      ) : songs.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-white/50">
          No songs found. {search || artist || genre ? 'Try clearing your filters.' : 'Ask an admin to upload some music.'}
        </div>
      ) : (
        <div className="space-y-2.5">
          {songs.map((song, index) => (
            <SongCard
              key={song._id}
              song={song}
              isActive={currentSong?._id === song._id}
              isPlaying={isPlaying}
              onPlay={() => handlePlay(index)}
              onAddToPlaylist={openAddToPlaylist}
            />
          ))}
        </div>
      )}

      {addModalSong && (
        <Modal title={`Add "${addModalSong.title}" to playlist`} onClose={() => setAddModalSong(null)}>
          {addMessage && (
            <div className="mb-3 text-sm text-brand-blue bg-brand-blue/10 border border-brand-blue/30 rounded-lg px-3 py-2">
              {addMessage}
            </div>
          )}
          {playlists.length === 0 ? (
            <p className="text-white/50 text-sm">
              You don't have any playlists yet. Create one from your Dashboard first.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlists.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handleAddToPlaylist(p._id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg glass hover:border-brand-blue/50 border border-transparent transition-colors text-left"
                >
                  <span className="text-white">{p.name}</span>
                  <span className="text-xs text-white/40">{p.songs?.length || 0} songs</span>
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Library;
