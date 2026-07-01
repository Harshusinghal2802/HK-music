import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../api/axios";
import SongCard from "../components/SongCard";
import { useAuth } from "../context/AuthContext";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [searched, setSearched] = useState(false);
  const { user } = useAuth();

  const albumFilter = searchParams.get("album");
  const artistFilter = searchParams.get("artist");

  useEffect(() => {
    if (albumFilter || artistFilter) {
      const params = new URLSearchParams();
      if (albumFilter) params.append("album", albumFilter);
      if (artistFilter) params.append("artist", artistFilter);
      api
        .get(`/songs?${params.toString()}`)
        .then((res) => {
          setResults(res.data);
          setSearched(true);
        })
        .catch(console.error);
    }
  }, [albumFilter, artistFilter]);

  useEffect(() => {
    if (!query.trim()) {
      if (!albumFilter && !artistFilter) {
        setResults([]);
        setSearched(false);
      }
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const { data } = await api.get(`/songs?search=${encodeURIComponent(query)}`);
        setResults(data);
        setSearched(true);
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/songs/favorites")
      .then((res) => setFavoriteIds(res.data.map((s) => s._id)))
      .catch(() => {});
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Search</h1>
      <div className="relative max-w-lg mb-8">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums..."
          className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 outline-none focus:border-primary"
        />
      </div>

      {searched && results.length === 0 && (
        <p className="text-gray-400">No results found for "{query}"</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((song) => (
          <SongCard
            key={song._id}
            song={song}
            songList={results}
            favoriteIds={favoriteIds}
            onFavoriteToggle={(id, isFav) =>
              setFavoriteIds((prev) => (isFav ? [...prev, id] : prev.filter((x) => x !== id)))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
