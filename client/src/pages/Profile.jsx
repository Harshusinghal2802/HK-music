import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const payload = { name };
      if (password) payload.password = password;
      const { data } = await api.put("/auth/profile", payload);
      updateUser(data);
      setPassword("");
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="flex items-center gap-4 mb-8">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1DB954&color=fff`}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
          {user.role === "admin" && (
            <span className="inline-block mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
      </div>

      {message && (
        <div className="bg-primary/20 text-primary text-sm px-4 py-2 rounded-lg mb-4">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 flex flex-col gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">New Password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-dark font-semibold py-3 rounded-full disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
