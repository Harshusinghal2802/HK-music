import { useEffect, useState } from "react";
import api from "../api/axios";
import SongCard from "../components/SongCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/songs");
        setSongs(data);

        if (user) {
          const favRes = await api.get("/songs/favorites");
          setFavoriteIds(favRes.data.map((s) => s._id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-gray-400">Loading songs...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-1">
        {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome to HK Music"}
      </h1>
      <p className="text-gray-400 mb-6">Discover and stream your favorite music</p>

      {songs.length === 0 ? (
        <p className="text-gray-400">No songs available yet. Check back soon!</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">All Songs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                songList={songs}
                favoriteIds={favoriteIds}
                onFavoriteToggle={(id, isFav) =>
                  setFavoriteIds((prev) =>
                    isFav ? [...prev, id] : prev.filter((x) => x !== id)
                  )
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
