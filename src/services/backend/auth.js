// Token keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Get the access token from localStorage
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

// Get the refresh token from localStorage
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// Save the access and refresh tokens to localStorage
export const saveTokens = (access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

// Remove the access and refresh tokens from localStorage
export const destroyTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Check if the user is authenticated (i.e., access token exists)
export const isAuthenticated = () => !!getAccessToken();

// Check if the refresh token exists
export const hasRefreshToken = () => !!getRefreshToken();
