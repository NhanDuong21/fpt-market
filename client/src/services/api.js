import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Forward error cleanly to context listeners to avoid layout crashing
            return Promise.reject({ status: error.response.status, message: "AUTH_EXPIRED" });
        }
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        error.message = message;
        return Promise.reject(error);
    }
);

export default api;
