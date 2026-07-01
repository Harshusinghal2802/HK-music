import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Albums from "./pages/Albums";
import Artists from "./pages/Artists";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Favorites from "./pages/Favorites";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UploadSong from "./pages/admin/UploadSong";
import ManageSongs from "./pages/admin/ManageSongs";
import ViewUsers from "./pages/admin/ViewUsers";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="albums" element={<Albums />} />
        <Route path="artists" element={<Artists />} />

        <Route
          path="playlists"
          element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          }
        />
        <Route
          path="playlists/:id"
          element={
            <ProtectedRoute>
              <PlaylistDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="recently-played"
          element={
            <ProtectedRoute>
              <RecentlyPlayed />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/upload"
          element={
            <AdminRoute>
              <UploadSong />
            </AdminRoute>
          }
        />
        <Route
          path="admin/songs"
          element={
            <AdminRoute>
              <ManageSongs />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <ViewUsers />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
