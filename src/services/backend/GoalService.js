import api from './api';
import { Goal } from '@/models/Goal';

const mapToGoal = (data) => new Goal(data.id, data.user, data.category, data.title, data.description, data.completed, data.start_date, data.times_per_day, data.days_per_week, data.duration, data.duration_unit);

export const getGoals = async () => {
    const response = await api.get('/goals/');
    return response.data.map(mapToGoal);
};

export const getGoalById = async (id) => {
    const response = await api.get(`/goals/${id}/`);
    return mapToGoal(response.data);
};

export const createGoal = async (data) => {
    const response = await api.post('/goals/', data);
    return mapToGoal(response.data);
};

export const updateGoal = async (id, data) => {
    const response = await api.put(`/goals/${id}/`, data);
    return mapToGoal(response.data);
};

export const deleteGoal = async (id) => {
    await api.delete(`/goals/${id}/`);
};
