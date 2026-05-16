// storage.js - Synchronize localStorage with Cookies for Middleware visibility

export const saveTokens = (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Sync to cookies for Next.js Middleware
        document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
    }
};

export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refreshToken');
    }
    return null;
};

export const clearTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Clear cookies
        document.cookie = 'accessToken=; path=/; max-age=0';
        document.cookie = 'userRole=; path=/; max-age=0';
    }
};

export const saveUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        
        // Sync role to cookies for Next.js Middleware
        if (user && user.role) {
            document.cookie = `userRole=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        }
    }
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
    }
    return null;
};
