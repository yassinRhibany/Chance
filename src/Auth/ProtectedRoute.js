import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import LoadingScreen from '../components/loadscreen/Loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق باستخدام الأرقام مباشرة
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// تعريف المسارات المحمية باستخدام الأرقام
export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[0]}>{children}</ProtectedRoute>
);

export const InvestorRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[1]}>{children}</ProtectedRoute>
);

export const FactoryOwnerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[2]}>{children}</ProtectedRoute>
);