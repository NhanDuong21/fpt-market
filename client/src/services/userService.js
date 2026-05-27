import api from './api';

export const userService = {
    getProfile: async () => (await api.get('/api/v1/users/me')).data.data,
    updateProfile: async (data) => (await api.put('/api/v1/users/me', data)).data.data,
    changePassword: async (data) => (await api.put('/api/v1/users/me/change-password', data)).data.data,
    uploadAvatar: async (formData) => (await api.put('/api/v1/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })).data.data
};
