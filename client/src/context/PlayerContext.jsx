import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import api, { SERVER_URL } from '../api/axios';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false); // repeat current song

  const currentSong = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, repeat, shuffle]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const recordPlay = (songId) => {
    api.post(`/songs/${songId}/play`).catch(() => {});
  };

  const loadAndPlay = (index, songsQueue) => {
    const list = songsQueue || queue;
    const song = list[index];
    if (!song) return;
    const audio = audioRef.current;
    audio.src = `${SERVER_URL}${song.audioUrl}`;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    setCurrentIndex(index);
    recordPlay(song._id);
  };

  // Play a list of songs starting at a given index (e.g. from library or playlist)
  const playQueue = useCallback((songs, startIndex = 0) => {
    setQueue(songs);
    loadAndPlay(startIndex, songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentSong) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const getNextIndex = () => {
    if (queue.length === 0) return -1;
    if (shuffle) {
      if (queue.length === 1) return 0;
      let next;
      do {
        next = Math.floor(Math.random() * queue.length);
      } while (next === currentIndex);
      return next;
    }
    return (currentIndex + 1) % queue.length;
  };

  const getPrevIndex = () => {
    if (queue.length === 0) return -1;
    if (shuffle) {
      if (queue.length === 1) return 0;
      let prev;
      do {
        prev = Math.floor(Math.random() * queue.length);
      } while (prev === currentIndex);
      return prev;
    }
    return (currentIndex - 1 + queue.length) % queue.length;
  };

  const next = () => {
    const idx = getNextIndex();
    if (idx >= 0) loadAndPlay(idx);
  };

  const prev = () => {
    const idx = getPrevIndex();
    if (idx >= 0) loadAndPlay(idx);
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (repeat) {
      audio.currentTime = 0;
      audio.play();
      return;
    }
    const idx = getNextIndex();
    if (idx >= 0) {
      loadAndPlay(idx);
    } else {
      setIsPlaying(false);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (v) => {
    setVolume(v);
  };

  const toggleShuffle = () => setShuffle((s) => !s);
  const toggleRepeat = () => setRepeat((r) => !r);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentSong,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffle,
        repeat,
        playQueue,
        togglePlay,
        stop,
        next,
        prev,
        seek,
        changeVolume,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
