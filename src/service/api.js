// src/services/api.js
import axios from 'axios';
import { destroyTokens, getAccessToken, getRefreshToken, saveTokens } from './auth';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
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

// Handle token expiration and refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken
                    });
                    const { access } = response.data;
                    saveTokens(access, refreshToken);
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    destroyTokens();
                    window.location.href = '/login';
                }
            } else {
                destroyTokens();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const login = (data) => api.post('/api/token/', data);
export const register = (data) => api.post('/auth/register/', data);
export const getMoods = () => api.get('/moods/');
export const createMoodLog = (data) => api.post('/mood-logs/', data);
export const getJournalEntries = () => api.get('/journal-entries/');
export const getSuggestions = () => api.get('/suggestions/');
export const getGoals = () => api.get('/goals/');
export const getInsights = () => api.get('/insights/');
