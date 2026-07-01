import { NavLink } from "react-router-dom";
import { FiHome, FiSearch, FiDisc, FiHeart, FiUser } from "react-icons/fi";

const BottomNav = () => {
  const links = [
    { to: "/", label: "Home", icon: <FiHome /> },
    { to: "/search", label: "Search", icon: <FiSearch /> },
    { to: "/albums", label: "Albums", icon: <FiDisc /> },
    { to: "/favorites", label: "Favorites", icon: <FiHeart /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong flex justify-around items-center py-2 z-40">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 text-xs ${
              isActive ? "text-primary" : "text-gray-400"
            }`
          }
        >
          <span className="text-xl">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
