import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import MusicPlayer from "../components/MusicPlayer";
import { usePlayer } from "../context/PlayerContext";

const MainLayout = () => {
  const { currentSong } = usePlayer();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main
          className={`flex-1 px-4 md:px-8 py-6 ${currentSong ? "pb-40 md:pb-24" : "pb-20 md:pb-6"}`}
        >
          <Outlet />
        </main>
      </div>
      <MusicPlayer />
      <BottomNav />
    </div>
  );
};

export default MainLayout;
