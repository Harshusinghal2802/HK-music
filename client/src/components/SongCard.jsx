import { FiPlay, FiHeart } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const SongCard = ({ song, songList, favoriteIds = [], onFavoriteToggle }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(favoriteIds.includes(song._id));

  useEffect(() => {
    setIsFav(favoriteIds.includes(song._id));
  }, [favoriteIds, song._id]);

  const isCurrentlyPlaying = currentSong?._id === song._id && isPlaying;

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const { data } = await api.post(`/songs/${song._id}/favorite`);
      setIsFav(data.isFavorite);
      if (onFavoriteToggle) onFavoriteToggle(song._id, data.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => playSong(song, songList)}
      className="glass rounded-xl p-3 cursor-pointer hover:bg-white/10 transition group relative"
    >
      <div className="relative mb-3">
        <img
          src={song.coverImage}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
          <div
            className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-dark ${
              isCurrentlyPlaying ? "opacity-100" : ""
            }`}
          >
            <FiPlay />
          </div>
        </div>
      </div>
      <p className="text-sm font-semibold truncate">{song.title}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        {user && (
          <button onClick={toggleFavorite} className="text-sm flex-shrink-0 ml-2">
            <FiHeart className={isFav ? "text-primary fill-primary" : "text-gray-400"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SongCard;
