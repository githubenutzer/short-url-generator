import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ShortUrlGenerator from './pages/ShortUrlGenerator';
import History from './pages/History';
import UrlStats from './pages/UrlStats';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/short-url-generator"
        element={
          <ProtectedRoute>
            <ShortUrlGenerator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/link/:short"
        element={
          <ProtectedRoute>
            <UrlStats />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
