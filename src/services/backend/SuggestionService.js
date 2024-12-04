import api from './api';
import { Suggestion } from '@/models/Suggestion';

/**
 * Maps raw API data to the `Suggestion` class
 * @param {Object} data - Raw API data
 * @returns {Suggestion}
 */
const mapToSuggestion = (data) =>
    new Suggestion(data.id, data.text, data.completed, data.created_at);

/**
 * Fetch all suggestions for the current user
 * @returns {Promise<Suggestion[]>}
 */
export const getSuggestions = async () => {
    const response = await api.get('/suggestions/');
    return response.data.map(mapToSuggestion);
};

/**
 * Fetch a suggestion by its ID
 * @param {number} id - Suggestion ID
 * @returns {Promise<Suggestion>}
 */
export const getSuggestionById = async (id) => {
    const response = await api.get(`/suggestions/${id}/`);
    return mapToSuggestion(response.data);
};

/**
 * Create a new suggestion
 * @param {Object} data - The suggestion data
 * @returns {Promise<Suggestion>}
 */
export const createSuggestion = async (data) => {
    const response = await api.post('/suggestions/', data);
    return mapToSuggestion(response.data);
};

/**
 * Update an existing suggestion
 * @param {number} id - Suggestion ID
 * @param {Object} data - The updated suggestion data
 * @returns {Promise<Suggestion>}
 */
export const updateSuggestion = async (id, data) => {
    const response = await api.put(`/suggestions/${id}/`, data);
    return mapToSuggestion(response.data);
};

/**
 * Mark a suggestion as completed
 * @param {number} id - Suggestion ID
 * @returns {Promise<void>}
 */
export const completeSuggestion = async (id) => {
    await api.patch(`/suggestions/${id}/`, { completed: true });
};

/**
 * Delete a suggestion
 * @param {number} id - Suggestion ID
 * @returns {Promise<void>}
 */
export const deleteSuggestion = async (id) => {
    await api.delete(`/suggestions/${id}/`);
};
