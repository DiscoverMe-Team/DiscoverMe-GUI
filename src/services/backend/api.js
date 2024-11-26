import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, destroyTokens, hasRefreshToken } from './auth';

const api = axios.create({
    baseURL:  import.meta.env.API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && hasRefreshToken()) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            try {
                const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                saveTokens(access, refreshToken);
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                destroyTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const login = (data) => api.post('/token/', data);
export const register = (data) => api.post('/register/', data);

export default api;
