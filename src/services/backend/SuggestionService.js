import api from './api';
import { Suggestion } from '@/models/Suggestion';

const mapToSuggestion = (data) => new Suggestion(data.id, data.mood_trigger, data.suggestion_text);

export const getSuggestions = async () => {
    const response = await api.get('/suggestions/');
    return response.data.map(mapToSuggestion);
};

export const getSuggestionById = async (id) => {
    const response = await api.get(`/suggestions/${id}/`);
    return mapToSuggestion(response.data);
};

export const createSuggestion = async (data) => {
    const response = await api.post('/suggestions/', data);
    return mapToSuggestion(response.data);
};

export const updateSuggestion = async (id, data) => {
    const response = await api.put(`/suggestions/${id}/`, data);
    return mapToSuggestion(response.data);
};

export const deleteSuggestion = async (id) => {
    await api.delete(`/suggestions/${id}/`);
};
