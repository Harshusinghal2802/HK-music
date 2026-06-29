import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 glass-strong border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/library" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center font-bold text-white">
            R
          </div>
          <span className="font-bold text-lg tracking-tight text-gradient">Resonance</span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/library" className={navLinkClass}>
            Library
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          {user.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-white/90">{user.name}</span>
            <span className="text-[11px] uppercase tracking-wide text-white/40">{user.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-brand-red/60 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
