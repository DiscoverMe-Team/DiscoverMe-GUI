import axios from 'axios';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

/**
 * Validate city and state using Nominatim API
 * @param {string} city - The city name
 * @param {string} state - The state abbreviation
 * @returns {Promise<boolean>} - True if valid, False otherwise
 */
export const validateCityStateWithOSM = async (city, state) => {
    try {
        const response = await axios.get(NOMINATIM_API, {
            params: {
                city,
                state,
                country: 'US',
                format: 'json',
            },
        });

        // Check if any results were returned
        return response.data.length > 0;
    } catch (error) {
        console.error('Error validating city/state:', error);
        throw error;
    }
};