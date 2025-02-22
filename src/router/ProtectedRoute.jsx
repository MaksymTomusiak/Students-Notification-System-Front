import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const isTokenExpired = () => {
    if (!user?.exp) return true;
    const expiryDate = new Date(user.exp * 1000);
    return expiryDate < new Date();
  };

  useEffect(() => {
    if (!user || isTokenExpired()) {
      localStorage.removeItem('user');

      if (location.pathname !== '/login') {
        const returnUrl = encodeURIComponent(location.pathname);
        navigate(`/login?returnUrl=${returnUrl}`);
      }
    }
  }, [user, navigate, location.pathname]);

  if (!user || isTokenExpired()) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <h1>Unauthorized</h1>;
  }

  return children;
};

export default ProtectedRoute;
