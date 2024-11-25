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

// Decode JWT payload without using external libraries
const decodeTokenPayload = (token) => {
    try {
        const base64Payload = token.split('.')[1]; // Get the payload part
        const decodedPayload = atob(base64Payload); // Decode Base64
        return JSON.parse(decodedPayload); // Parse JSON
    } catch (error) {
        console.error('Error decoding token payload:', error);
        return null;
    }
};

// Check if the user is authenticated (i.e., access token exists and is valid)
export const isAuthenticated = () => {
    const token = getAccessToken();
    if (!token) return false;

    const payload = decodeTokenPayload(token);
    if (!payload || !payload.exp) return false;

    // Check if the token is expired
    return Date.now() < payload.exp * 1000; // `exp` is in seconds; `Date.now()` is in milliseconds
};

// Check if the refresh token exists
export const hasRefreshToken = () => !!getRefreshToken();

// Token expiration check with optional grace period (in seconds)
export const isAccessTokenExpiringSoon = (gracePeriod = 60) => {
    const token = getAccessToken();
    if (!token) return true;

    const payload = decodeTokenPayload(token);
    if (!payload || !payload.exp) return true;

    // Check if token will expire within the grace period
    return Date.now() >= (payload.exp * 1000 - gracePeriod * 1000);
};
