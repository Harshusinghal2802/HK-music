import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

const StatCard = ({ label, value, accent }) => (
  <div className="glass rounded-xl p-6 card-hover">
    <p className="text-white/50 text-sm mb-1">{label}</p>
    <p className={`text-3xl font-bold ${accent}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { playQueue, currentSong, isPlaying } = usePlayer();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [recent, setRecent] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [createError, setCreateError] = useState('');

  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (user.role === 'admin') {
        const res = await api.get('/stats/admin');
        setStats(res.data);
      } else {
        const [plRes, recentRes] = await Promise.all([
          api.get('/playlists'),
          api.get('/songs/recent/played'),
        ]);
        setPlaylists(plRes.data);
        setRecent(recentRes.data);
      }
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    if (!newName.trim()) return;
    try {
      await api.post('/playlists', { name: newName.trim() });
      setNewName('');
      setShowCreate(false);
      loadData();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Could not create playlist');
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    try {
      await api.put(`/playlists/${renameTarget._id}`, { name: renameValue.trim() });
      setRenameTarget(null);
      loadData();
    } catch {
      // ignore
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/playlists/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadData();
    } catch {
      // ignore
    }
  };

  if (loading) return <Loader label="Loading dashboard..." />;

  if (user.role === 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-white/50 text-sm mb-6">An overview of the entire platform.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Songs" value={stats.totalSongs} accent="text-brand-red" />
          <StatCard label="Total Users" value={stats.totalUsers} accent="text-brand-blue" />
          <StatCard label="Total Playlists" value={stats.totalPlaylists} accent="text-gradient" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-1">My Dashboard</h1>
      <p className="text-white/50 text-sm mb-6">Your playlists and listening history.</p>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">My Playlists</h2>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg btn-gradient text-sm">
          + New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-white/50 mb-8">
          You haven't created any playlists yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {playlists.map((p) => (
            <PlaylistCard
              key={p._id}
              playlist={p}
              onRename={(pl) => {
                setRenameTarget(pl);
                setRenameValue(pl.name);
              }}
              onDelete={(pl) => setDeleteTarget(pl)}
            />
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold text-white mb-4">Recently Played</h2>
      {recent.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-white/50">
          Nothing played yet. Head to the Library and start listening.
        </div>
      ) : (
        <div className="space-y-2.5">
          {recent.map((song, index) => (
            <SongCard
              key={song._id}
              song={song}
              isActive={currentSong?._id === song._id}
              isPlaying={isPlaying}
              onPlay={() => playQueue(recent, index)}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Create New Playlist" onClose={() => setShowCreate(false)}>
          {createError && (
            <div className="mb-3 text-sm text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-lg px-3 py-2">
              {createError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-4 py-2.5 rounded-lg input-glass"
            />
            <button type="submit" className="w-full py-2.5 rounded-lg btn-gradient">
              Create
            </button>
          </form>
        </Modal>
      )}

      {renameTarget && (
        <Modal title="Rename Playlist" onClose={() => setRenameTarget(null)}>
          <form onSubmit={handleRename} className="space-y-4">
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-4 py-2.5 rounded-lg input-glass"
            />
            <button type="submit" className="w-full py-2.5 rounded-lg btn-gradient">
              Save Changes
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Playlist" onClose={() => setDeleteTarget(null)}>
          <p className="text-white/70 mb-5">
            Are you sure you want to delete <span className="text-white font-medium">{deleteTarget.name}</span>?
            This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 rounded-lg border border-white/15 text-white/70 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-lg bg-brand-red text-white hover:brightness-110"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
