import api from './api';
import { Insight } from '@/models/Insight';

const mapToInsight = (data) => new Insight(data.id, data.user, data.trigger_word, data.time_quantity, data.time_frame, data.mood_count, data.created_at);

export const getInsights = async () => {
    const response = await api.get('/insights/');
    return response.data.map(mapToInsight);
};

export const getInsightById = async (id) => {
    const response = await api.get(`/insights/${id}/`);
    return mapToInsight(response.data);
};

export const createInsight = async (data) => {
    const response = await api.post('/insights/', data);
    return mapToInsight(response.data);
};

export const updateInsight = async (id, data) => {
    const response = await api.put(`/insights/${id}/`, data);
    return mapToInsight(response.data);
};

export const deleteInsight = async (id) => {
    await api.delete(`/insights/${id}/`);
};
