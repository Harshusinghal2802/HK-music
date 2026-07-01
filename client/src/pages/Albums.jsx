import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiDisc } from "react-icons/fi";
import api from "../api/axios";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/songs/albums")
      .then((res) => setAlbums(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading albums...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Albums</h1>
      {albums.length === 0 ? (
        <p className="text-gray-400">No albums available yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <Link
              key={album._id}
              to={`/search?album=${encodeURIComponent(album._id)}`}
              className="glass rounded-xl p-3 hover:bg-white/10 transition"
            >
              {album.coverImage ? (
                <img
                  src={album.coverImage}
                  alt={album._id}
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full aspect-square bg-white/5 rounded-lg mb-3 flex items-center justify-center">
                  <FiDisc className="text-3xl text-gray-500" />
                </div>
              )}
              <p className="text-sm font-semibold truncate">{album._id}</p>
              <p className="text-xs text-gray-400 truncate">
                {album.artist} · {album.songCount} songs
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Albums;
