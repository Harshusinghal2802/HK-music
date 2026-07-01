import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiDisc,
  FiUsers,
  FiHeart,
  FiClock,
  FiUser,
  FiList,
  FiUploadCloud,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const links = [
    { to: "/", label: "Home", icon: <FiHome /> },
    { to: "/search", label: "Search", icon: <FiSearch /> },
    { to: "/albums", label: "Albums", icon: <FiDisc /> },
    { to: "/artists", label: "Artists", icon: <FiUsers /> },
    { to: "/playlists", label: "Playlists", icon: <FiList /> },
    { to: "/favorites", label: "Favorites", icon: <FiHeart /> },
    { to: "/recently-played", label: "Recently Played", icon: <FiClock /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 glass-strong p-5">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-dark">
          HK
        </div>
        <span className="text-xl font-bold tracking-tight">HK Music</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="mt-4 mb-1 px-4 text-xs uppercase text-gray-500 font-semibold">
              Admin
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <FiUploadCloud className="text-lg" />
              Dashboard
            </NavLink>
          </>
        )}
      </nav>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
            isActive ? "bg-primary/20 text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white"
          }`
        }
      >
        <FiUser className="text-lg" />
        {user?.name || "Profile"}
      </NavLink>
    </aside>
  );
};

export default Sidebar;
