import { usePlayer } from '../context/PlayerContext';
import { SERVER_URL } from '../api/axios';

const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const Icon = ({ d, className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={d} />
  </svg>
);

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlay,
    stop,
    next,
    prev,
    seek,
    changeVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10 animate-slide-up">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Song info */}
        <div className="flex items-center gap-3 w-48 sm:w-64 flex-shrink-0 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-gradient-soft flex-shrink-0">
            {currentSong.coverUrl && (
              <img
                src={`${SERVER_URL}${currentSong.coverUrl}`}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-white/45 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls + seek */}
        <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              title="Shuffle"
              className={`transition-colors ${shuffle ? 'text-brand-blue' : 'text-white/50 hover:text-white'}`}
            >
              <Icon
                className="w-4 h-4"
                d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"
              />
            </button>
            <button onClick={prev} title="Previous" className="text-white/80 hover:text-white">
              <Icon d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </button>
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center"
            >
              {isPlaying ? (
                <Icon d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              ) : (
                <Icon d="M8 5v14l11-7z" />
              )}
            </button>
            <button onClick={next} title="Next" className="text-white/80 hover:text-white">
              <Icon d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </button>
            <button onClick={stop} title="Stop" className="text-white/50 hover:text-white">
              <Icon className="w-4 h-4" d="M6 6h12v12H6z" />
            </button>
            <button
              onClick={toggleRepeat}
              title="Repeat"
              className={`transition-colors ${repeat ? 'text-brand-red' : 'text-white/50 hover:text-white'}`}
            >
              <Icon
                className="w-4 h-4"
                d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"
              />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-[11px] text-white/40 w-9 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1 accent-brand-blue cursor-pointer"
            />
            <span className="text-[11px] text-white/40 w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 w-28 flex-shrink-0">
          <Icon className="w-4 h-4 text-white/50" d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="flex-1 h-1 accent-brand-red cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
