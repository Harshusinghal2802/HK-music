import { useNavigate } from "react-router-dom";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 glass">
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-dark text-sm">
          HK
        </div>
        <span className="font-bold">HK Music</span>
      </div>
      <div className="hidden md:block" />

      {user ? (
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1DB954&color=fff`}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <FiLogOut /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 text-sm bg-primary text-dark font-semibold px-4 py-2 rounded-full"
        >
          <FiLogIn /> Login
        </button>
      )}
    </header>
  );
};

export default Navbar;
