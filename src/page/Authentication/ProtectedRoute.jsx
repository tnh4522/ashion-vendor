import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import {hasAllPermissions, hasAnyPermission} from "../../constant/permissions.js";

function ProtectedRoute({ children, requiredPermissions, requireAll = false }) {
    const { userData } = useContext(UserContext);

    if (!userData) {

        return <Navigate to="/login" replace />;
    }

    if (requiredPermissions && requiredPermissions.length > 0 && userData.role !== 'ADMIN') {
        if (requireAll) {
            if (!hasAllPermissions(userData.scope, requiredPermissions)) {
                return <Navigate to="/unauthorized" replace />;
            }
        } else {
            if (!hasAnyPermission(userData.scope, requiredPermissions)) {
                return <Navigate to="/unauthorized" replace />;
            }
        }
    }


    return children;
}

export default ProtectedRoute;
