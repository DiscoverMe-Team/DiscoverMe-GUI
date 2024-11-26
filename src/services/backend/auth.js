const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const saveTokens = (access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const destroyTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const decodeTokenPayload = (token) => {
    try {
        const base64Payload = token.split('.')[1];
        const decodedPayload = atob(base64Payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding token payload:', error);
        return null;
    }
};

export const isAuthenticated = () => {
    const token = getAccessToken();
    if (!token) return false;

    const payload = decodeTokenPayload(token);
    if (!payload || !payload.exp) return false;

    return Date.now() < payload.exp * 1000;
};


export const hasRefreshToken = () => !!getRefreshToken();

export const isAccessTokenExpiringSoon = (gracePeriod = 60) => {
    const token = getAccessToken();
    if (!token) return true;

    const payload = decodeTokenPayload(token);
    if (!payload || !payload.exp) return true;


    return Date.now() >= (payload.exp * 1000 - gracePeriod * 1000);
};
