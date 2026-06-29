import { Link } from 'react-router-dom';

const PlaylistCard = ({ playlist, onRename, onDelete }) => {
  return (
    <div className="glass rounded-xl p-4 card-hover flex flex-col gap-3">
      <Link to={`/playlists/${playlist._id}`} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
          {playlist.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-white truncate">{playlist.name}</p>
          <p className="text-sm text-white/45">{playlist.songs?.length || 0} songs</p>
        </div>
      </Link>
      {(onRename || onDelete) && (
        <div className="flex gap-2 pt-1 border-t border-white/10">
          {onRename && (
            <button
              onClick={() => onRename(playlist)}
              className="flex-1 text-xs py-1.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            >
              Rename
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(playlist)}
              className="flex-1 text-xs py-1.5 rounded-lg border border-white/15 text-white/60 hover:text-brand-red hover:border-brand-red/50 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistCard;
