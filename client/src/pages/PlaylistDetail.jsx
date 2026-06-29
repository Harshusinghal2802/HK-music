import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import Loader from '../components/Loader';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playQueue, currentSong, isPlaying } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlaylist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/playlists/${id}`);
      setPlaylist(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load playlist');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  const handleRemove = async (song) => {
    try {
      const res = await api.delete(`/playlists/${id}/songs/${song._id}`);
      setPlaylist(res.data);
    } catch {
      // ignore
    }
  };

  const handlePlay = (index) => {
    playQueue(playlist.songs, index);
  };

  if (loading) return <Loader label="Loading playlist..." />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass rounded-xl p-6 text-brand-red text-center">{error}</div>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand-blue hover:underline">
          &larr; Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/dashboard" className="text-sm text-white/50 hover:text-white">
        &larr; Back to Dashboard
      </Link>
      <div className="flex items-center gap-4 mt-3 mb-6">
        <div className="w-16 h-16 rounded-xl bg-brand-gradient flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {playlist.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
          <p className="text-white/50 text-sm">{playlist.songs.length} songs</p>
        </div>
        {playlist.songs.length > 0 && (
          <button onClick={() => handlePlay(0)} className="ml-auto px-5 py-2.5 rounded-lg btn-gradient">
            Play All
          </button>
        )}
      </div>

      {playlist.songs.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-white/50">
          This playlist is empty. Add songs from the Library.
        </div>
      ) : (
        <div className="space-y-2.5">
          {playlist.songs.map((song, index) => (
            <SongCard
              key={song._id}
              song={song}
              isActive={currentSong?._id === song._id}
              isPlaying={isPlaying}
              onPlay={() => handlePlay(index)}
              onRemoveFromPlaylist={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
