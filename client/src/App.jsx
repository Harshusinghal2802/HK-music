import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Loader from './components/Loader';

import Setup from './pages/Setup';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { user, loading, setupRequired } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Starting Resonance..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28">
        <Routes>
          <Route
            path="/setup"
            element={setupRequired ? <Setup /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={
              setupRequired ? (
                <Navigate to="/setup" replace />
              ) : user ? (
                <Navigate to="/library" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              setupRequired ? (
                <Navigate to="/setup" replace />
              ) : user ? (
                <Navigate to="/library" replace />
              ) : (
                <Register />
              )
            }
          />

          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists/:id"
            element={
              <ProtectedRoute>
                <PlaylistDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          <Route
            path="/"
            element={
              <Navigate to={setupRequired ? '/setup' : user ? '/library' : '/login'} replace />
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={setupRequired ? '/setup' : user ? '/library' : '/login'} replace />
            }
          />
        </Routes>
      </main>
      <PlayerBar />
    </div>
  );
}

export default App;
