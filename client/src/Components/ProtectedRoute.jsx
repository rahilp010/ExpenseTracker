import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
   const isAuthenticated = useSelector(
      (state) => state.credential.isAuthenticated
   );
   const location = useLocation();

   if (
      !isAuthenticated &&
      location.pathname !== '/' &&
      location.pathname !== '/signup'
   ) {
      return <Navigate to="/" replace />;
   }

   return children;
};

export default ProtectedRoute;
