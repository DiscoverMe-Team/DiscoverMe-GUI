import api from './api';
import { Mood } from '@/models/Mood';

const mapToMood = (data) => new Mood(data.id, data.mood_type, data.mood_description);

export const getMoods = async () => {
    const response = await api.get('/mood/');
    return response.data.map(mapToMood);
};

export const getMoodById = async (id) => {
    const response = await api.get(`/mood/${id}/`);
    return mapToMood(response.data);
};
