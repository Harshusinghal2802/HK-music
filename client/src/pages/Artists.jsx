import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import api from "../api/axios";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/songs/artists")
      .then((res) => setArtists(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading artists...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Artists</h1>
      {artists.length === 0 ? (
        <p className="text-gray-400">No artists available yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <Link
              key={artist._id}
              to={`/search?artist=${encodeURIComponent(artist._id)}`}
              className="glass rounded-xl p-4 hover:bg-white/10 transition flex flex-col items-center text-center"
            >
              {artist.coverImage ? (
                <img
                  src={artist.coverImage}
                  alt={artist._id}
                  className="w-24 h-24 object-cover rounded-full mb-3"
                />
              ) : (
                <div className="w-24 h-24 bg-white/5 rounded-full mb-3 flex items-center justify-center">
                  <FiUser className="text-3xl text-gray-500" />
                </div>
              )}
              <p className="text-sm font-semibold truncate w-full">{artist._id}</p>
              <p className="text-xs text-gray-400">{artist.songCount} songs</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Artists;
