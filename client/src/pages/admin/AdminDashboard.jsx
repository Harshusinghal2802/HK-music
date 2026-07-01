import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUploadCloud, FiMusic, FiUsers, FiBarChart2 } from "react-icons/fi";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/songs/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-gray-400 mb-6">Manage your HK Music platform</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-5">
          <FiMusic className="text-primary text-2xl mb-2" />
          <p className="text-2xl font-bold">{stats?.totalSongs ?? "-"}</p>
          <p className="text-sm text-gray-400">Total Songs</p>
        </div>
        <div className="glass rounded-xl p-5">
          <FiUsers className="text-primary text-2xl mb-2" />
          <p className="text-2xl font-bold">{stats?.totalUsers ?? "-"}</p>
          <p className="text-sm text-gray-400">Total Users</p>
        </div>
        <div className="glass rounded-xl p-5">
          <FiBarChart2 className="text-primary text-2xl mb-2" />
          <p className="text-2xl font-bold">{stats?.totalPlays ?? "-"}</p>
          <p className="text-sm text-gray-400">Total Plays</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          to="/admin/upload"
          className="flex items-center gap-2 bg-primary text-dark font-semibold px-5 py-3 rounded-full text-sm"
        >
          <FiUploadCloud /> Upload Song
        </Link>
        <Link
          to="/admin/songs"
          className="flex items-center gap-2 glass px-5 py-3 rounded-full text-sm"
        >
          <FiMusic /> Manage Songs
        </Link>
        <Link
          to="/admin/users"
          className="flex items-center gap-2 glass px-5 py-3 rounded-full text-sm"
        >
          <FiUsers /> View Users
        </Link>
      </div>

      {stats?.topSongs?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Top Songs</h2>
          <div className="flex flex-col gap-1">
            {stats.topSongs.map((song, index) => (
              <div key={song._id} className="flex items-center gap-3 glass rounded-lg px-4 py-3">
                <span className="text-gray-500 w-5">{index + 1}</span>
                <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
                <span className="text-sm text-gray-400">{song.plays} plays</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
