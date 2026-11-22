// quan ly trang thai xac thuc nguoi dung, cung cap cac ham login/logout va tu dong refresh profile khi co token
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from 'react';
import { authService } from '../services/authService';
import { wishlistService } from '../services/wishlistService';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getUser());
    const [token, setToken] = useState(authService.getToken());
    const clearAuthState = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        wishlistService.resetLocal();
        setUser(null);
        setToken(null);
    }, []);
    const login = useCallback((userData, accessToken, rememberMe) => {
        authService.persistSession(userData, accessToken, rememberMe);
        setUser(userData);
        setToken(accessToken);
    }, []);
    const logout = useCallback(async () => {
        // Luôn xoá trạng thái đăng nhập phía client, kể cả khi API logout lỗi
        // (token hết hạn, mất mạng...). Trước đây lỗi ở đây khiến state không được
        // dọn, UI vẫn hiện đã đăng nhập cho tới khi reload trang.
        try {
            await authService.logout();
        }
        finally {
            wishlistService.resetLocal();
            setUser(null);
            setToken(null);
        }
    }, []);
    const isAuthenticated = useCallback(() => !!token, [token]);
    const updateUser = useCallback((userData) => {
        setUser(userData);
        if (localStorage.getItem('authToken')) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
        else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }
    }, []);
    useEffect(() => {
        const handleUnauthorized = () => clearAuthState();
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [clearAuthState]);
    useEffect(() => {
        const handleLogoutNav = (event) => {
            const detail = event.detail;
            if (detail?.redirectTo && window.location.pathname !== detail.redirectTo) {
                window.location.href = detail.redirectTo;
            }
        };
        window.addEventListener('auth:logout', handleLogoutNav);
        return () => window.removeEventListener('auth:logout', handleLogoutNav);
    }, []);
    useEffect(() => {
        if (!token)
            return;
        const refreshProfile = async () => {
            try {
                const profile = await authService.getUserProfile();
                setUser(profile);
                if (localStorage.getItem('authToken')) {
                    localStorage.setItem('user', JSON.stringify(profile));
                }
                else {
                    sessionStorage.setItem('user', JSON.stringify(profile));
                }
            }
            catch {
                /* dùng cache local nếu API lỗi */
            }
        };
        void refreshProfile();
        // Đồng bộ wishlist từ server vào localStorage khi đã có phiên đăng nhập
        void wishlistService.syncFromServer();
    }, [token]);
    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        isAuthenticated,
        clearAuthState,
        updateUser,
    }), [user, token, login, logout, isAuthenticated, clearAuthState, updateUser]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được dùng bên trong AuthProvider');
    }
    return context;
};
