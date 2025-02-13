import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
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
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || isTokenExpired()) {
    return null;
  }

  return (
    <>
      {allowedRoles?.includes(user?.role ?? '') ? (
        children
      ) : (
        <h1>Unauthorized</h1>
      )}
    </>
  );
};

export default ProtectedRoute;
