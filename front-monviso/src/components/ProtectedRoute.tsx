import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children
}) => {
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  if (isLoading) {
    // You could show a loading spinner here
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
      </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/get-started" replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;