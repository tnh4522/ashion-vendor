import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';

function ProtectedRoute({ children }) {
    const { userData } = useContext(UserContext);

    if (!userData) {

        return <Navigate to="/login" replace />;
    }


    return children;
}

export default ProtectedRoute;
