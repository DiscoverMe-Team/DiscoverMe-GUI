import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, destroyTokens, hasRefreshToken } from './auth';

const api = axios.create({
    baseURL: import.meta.env.API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the JWT access token to every request
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

// Handle token expiration and automatic refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the response status is 401 (Unauthorized) and it hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry && hasRefreshToken()) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            try {
                // Attempt to refresh the access token
                const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                // Save the new tokens
                saveTokens(access, refreshToken);

                // Update the Authorization header with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${access}`;

                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                // If token refresh fails, destroy tokens and redirect to login
                destroyTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Authentication API calls
export const login = (data) => api.post('/token/', data);
export const register = (data) => api.post('/register/', data);
export const changePassword = (data) => api.post('/auth/change-password/', data);

// User-related API calls
export const getUserInfo = () => api.get('/user-info/');
export const updateUserDetails = (data) => api.put('/auth/update-user/', data);

export default api;
