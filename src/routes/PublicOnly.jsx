import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function PublicOnly({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;

  return children;
}
