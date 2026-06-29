import { SERVER_URL } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const SongCard = ({
  song,
  isActive,
  isPlaying,
  onPlay,
  onEdit,
  onDelete,
  onAddToPlaylist,
  onRemoveFromPlaylist,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div
      className={`glass rounded-xl p-3 flex items-center gap-3 card-hover ${
        isActive ? 'ring-2 ring-brand-blue/60' : ''
      }`}
    >
      <button
        onClick={onPlay}
        className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-brand-gradient-soft flex items-center justify-center group"
        title="Play"
      >
        {song.coverUrl ? (
          <img
            src={`${SERVER_URL}${song.coverUrl}`}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white/40 text-xs">No Art</span>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isActive && isPlaying ? (
            <div className="flex gap-0.5 items-end h-4">
              <span className="w-1 bg-white animate-pulse" style={{ height: '60%' }} />
              <span className="w-1 bg-white animate-pulse" style={{ height: '100%' }} />
              <span className="w-1 bg-white animate-pulse" style={{ height: '40%' }} />
            </div>
          ) : (
            <span className="text-white">
              <PlayIcon />
            </span>
          )}
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${isActive ? 'text-brand-blue' : 'text-white'}`}>
          {song.title}
        </p>
        <p className="text-sm text-white/50 truncate">
          {song.artist} <span className="text-white/30">•</span> {song.genre}
        </p>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onAddToPlaylist && (
          <button
            onClick={() => onAddToPlaylist(song)}
            title="Add to playlist"
            className="w-8 h-8 rounded-lg border border-white/15 text-white/60 hover:text-brand-blue hover:border-brand-blue/50 flex items-center justify-center transition-colors"
          >
            +
          </button>
        )}
        {onRemoveFromPlaylist && (
          <button
            onClick={() => onRemoveFromPlaylist(song)}
            title="Remove from playlist"
            className="w-8 h-8 rounded-lg border border-white/15 text-white/60 hover:text-brand-red hover:border-brand-red/50 flex items-center justify-center transition-colors"
          >
            −
          </button>
        )}
        {isAdmin && onEdit && (
          <button
            onClick={() => onEdit(song)}
            title="Edit song"
            className="w-8 h-8 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors text-xs"
          >
            ✎
          </button>
        )}
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(song)}
            title="Delete song"
            className="w-8 h-8 rounded-lg border border-white/15 text-white/60 hover:text-brand-red hover:border-brand-red/50 flex items-center justify-center transition-colors text-xs"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
};

export default SongCard;
