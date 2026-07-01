import { useEffect, useState } from "react";
import api from "../api/axios";
import SongCard from "../components/SongCard";

const RecentlyPlayed = () => {
  const [songs, setSongs] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, favRes] = await Promise.all([
          api.get("/songs/recently-played"),
          api.get("/songs/favorites"),
        ]);
        setSongs(recentRes.data);
        setFavoriteIds(favRes.data.map((s) => s._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-gray-400">Loading history...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recently Played</h1>
      {songs.length === 0 ? (
        <p className="text-gray-400">You haven't played any songs yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songList={songs}
              favoriteIds={favoriteIds}
              onFavoriteToggle={(id, isFav) =>
                setFavoriteIds((prev) => (isFav ? [...prev, id] : prev.filter((x) => x !== id)))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyPlayed;
