import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('Token'); // Use the same key as in App.jsx
    const location = useLocation();

    if (!isAuthenticated) {
        const redirectTo = location.pathname + location.search;
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
