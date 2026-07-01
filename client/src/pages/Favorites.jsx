import { useEffect, useState } from "react";
import api from "../api/axios";
import SongCard from "../components/SongCard";

const Favorites = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get("/songs/favorites");
      setSongs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <div className="text-gray-400">Loading favorites...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      {songs.length === 0 ? (
        <p className="text-gray-400">You haven't favorited any songs yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songList={songs}
              favoriteIds={songs.map((s) => s._id)}
              onFavoriteToggle={(id, isFav) => {
                if (!isFav) setSongs((prev) => prev.filter((s) => s._id !== id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
