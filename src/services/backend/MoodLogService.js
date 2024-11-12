import api from './api';
import { MoodLog } from '@/models/MoodLog';

const mapToMoodLog = (data) => new MoodLog(data.id, data.user, data.mood, data.date_logged, data.notes);

export const getMoodLogs = async () => {
    const response = await api.get('/moodlogs/');
    return response.data.map(mapToMoodLog);
};

export const getMoodLogById = async (id) => {
    const response = await api.get(`/moodlogs/${id}/`);
    return mapToMoodLog(response.data);
};

export const createMoodLog = async (data) => {
    const response = await api.post('/moodlogs/', data);
    return mapToMoodLog(response.data);
};

export const updateMoodLog = async (id, data) => {
    const response = await api.put(`/moodlogs/${id}/`, data);
    return mapToMoodLog(response.data);
};

export const deleteMoodLog = async (id) => {
    await api.delete(`/moodlogs/${id}/`);
};
