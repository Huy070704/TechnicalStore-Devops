import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleName, getAdminHomePath } from '@/services/authService';
/**
 * Bảo vệ route theo role:
 * - Chưa đăng nhập → /login
 * - Sai role → redirect về trang home của role đó
 * - Đúng role → render children
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace/>;
    }
    const roleName = getRoleName(user)?.toLowerCase() ?? '';
    if (!allowedRoles.includes(roleName)) {
        const homePath = getAdminHomePath(roleName) ?? '/';
        return <Navigate to={homePath} replace/>;
    }
    return <>{children}</>;
};
export default ProtectedRoute;
