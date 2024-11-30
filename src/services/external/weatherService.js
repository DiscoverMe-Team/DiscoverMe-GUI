import axios from 'axios';

// Replace with your OpenWeatherMap API Key
const API_KEY = '09831df3c2aaac49db3a3cdbe625ff5e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
export const fetchWeather = async (city, state) => {
    if (!city || !state) {
        throw new Error('City and state are required.');
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: `${city},${state},US`,
                appid: API_KEY,
                units: 'imperial',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Invalid city/state.');
        }
        throw new Error('Unable to reach the weather service.');
    }
};
