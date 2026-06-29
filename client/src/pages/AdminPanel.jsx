import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

const emptyForm = { title: '', artist: '', genre: '', audio: null, cover: null };

const AdminPanel = () => {
  const { playQueue, currentSong, isPlaying } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/songs');
      setSongs(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const openAddForm = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (song) => {
    setEditTarget(song);
    setForm({ title: song.title, artist: song.artist, genre: song.genre, audio: null, cover: null });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title.trim() || !form.artist.trim() || !form.genre.trim()) {
      setFormError('Title, artist and genre are required');
      return;
    }
    if (!editTarget && !form.audio) {
      setFormError('Please select an audio file');
      return;
    }

    const data = new FormData();
    data.append('title', form.title.trim());
    data.append('artist', form.artist.trim());
    data.append('genre', form.genre.trim());
    if (form.audio) data.append('audio', form.audio);
    if (form.cover) data.append('cover', form.cover);

    setSubmitting(true);
    try {
      if (editTarget) {
        await api.put(`/songs/${editTarget._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/songs', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowForm(false);
      fetchSongs();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save song');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/songs/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchSongs();
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <button onClick={openAddForm} className="px-4 py-2 rounded-lg btn-gradient text-sm">
          + Add Song
        </button>
      </div>
      <p className="text-white/50 text-sm mb-6">Manage every song in the library.</p>

      {loading ? (
        <Loader label="Loading songs..." />
      ) : songs.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-white/50">
          No songs yet. Click "Add Song" to upload your first track.
        </div>
      ) : (
        <div className="space-y-2.5">
          {songs.map((song, index) => (
            <SongCard
              key={song._id}
              song={song}
              isActive={currentSong?._id === song._id}
              isPlaying={isPlaying}
              onPlay={() => playQueue(songs, index)}
              onEdit={openEditForm}
              onDelete={(s) => setDeleteTarget(s)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <Modal title={editTarget ? 'Edit Song' : 'Add New Song'} onClose={() => setShowForm(false)}>
          {formError && (
            <div className="mb-3 text-sm text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg input-glass"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Artist</label>
              <input
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg input-glass"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Genre</label>
              <input
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg input-glass"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Audio File (MP3) {editTarget && <span className="text-white/35">— leave empty to keep current</span>}
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setForm({ ...form, audio: e.target.files[0] })}
                className="w-full text-sm text-white/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-gradient file:text-white file:cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Cover Image {editTarget && <span className="text-white/35">— leave empty to keep current</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, cover: e.target.files[0] })}
                className="w-full text-sm text-white/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-gradient file:text-white file:cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg btn-gradient disabled:opacity-60"
            >
              {submitting ? 'Saving...' : editTarget ? 'Save Changes' : 'Upload Song'}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Song" onClose={() => setDeleteTarget(null)}>
          <p className="text-white/70 mb-5">
            Are you sure you want to delete <span className="text-white font-medium">{deleteTarget.title}</span>?
            This will remove it from all playlists too.
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

export default AdminPanel;
