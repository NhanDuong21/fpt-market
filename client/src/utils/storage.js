// Empty wrapper functions for storage

export const saveTokens = (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
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
    }
};

export const saveUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
    }
    return null;
};
