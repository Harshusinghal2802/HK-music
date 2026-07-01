import { createContext, useContext, useState, useRef, useEffect } from "react";
import api from "../api/axios";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => playNext();

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playSong = (song, songList = null) => {
    const list = songList || [song];
    const index = list.findIndex((s) => s._id === song._id);

    setQueue(list);
    setCurrentIndex(index >= 0 ? index : 0);
    setCurrentSong(song);

    audioRef.current.src = song.audioUrl;
    audioRef.current.play();
    setIsPlaying(true);

    api.post(`/songs/${song._id}/play`).catch(() => {});
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];
    setCurrentIndex(nextIndex);
    setCurrentSong(nextSong);
    audioRef.current.src = nextSong.audioUrl;
    audioRef.current.play();
    setIsPlaying(true);
    api.post(`/songs/${nextSong._id}/play`).catch(() => {});
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prevSong = queue[prevIndex];
    setCurrentIndex(prevIndex);
    setCurrentSong(prevSong);
    audioRef.current.src = prevSong.audioUrl;
    audioRef.current.play();
    setIsPlaying(true);
    api.post(`/songs/${prevSong._id}/play`).catch(() => {});
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
