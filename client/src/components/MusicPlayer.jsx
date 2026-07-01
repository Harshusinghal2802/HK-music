import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2 } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext";

const formatTime = (time) => {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 md:left-64 z-40 glass-strong px-4 py-3">
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 w-1/3 min-w-0">
          <img
            src={currentSong.coverImage}
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{currentSong.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1 max-w-xl">
          <div className="flex items-center gap-5">
            <button onClick={playPrevious} className="text-gray-300 hover:text-white text-lg">
              <FiSkipBack />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-dark"
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button onClick={playNext} className="text-gray-300 hover:text-white text-lg">
              <FiSkipForward />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-9 text-right">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-9">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 w-1/3 justify-end">
          <FiVolume2 className="text-gray-300" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
