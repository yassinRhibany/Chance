import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import LoadingScreen from '../../components/loadscreen/Loading';

export const ProtectedLayout = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};