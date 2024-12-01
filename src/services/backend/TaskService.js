import api from './api';
import { Task } from '@/models/Task';

// Map API response to Task instance
const mapToTask = (data) => new Task(data.id, data.goal, data.text, data.completed);

// Fetch all tasks for a specific goal
export const getTasksByGoal = async (goalId) => {
    const response = await api.get(`/tasks/?goal=${goalId}`);
    return response.data.map(mapToTask);
};

// Fetch a single task by ID
export const getTaskById = async (id) => {
    const response = await api.get(`/tasks/${id}/`);
    return mapToTask(response.data);
};

// Create a new task
export const createTask = async (data) => {
    console.log("Task data being sent to API:", data);
    const response = await api.post('/tasks/', data);
    return mapToTask(response.data);
};

// Update an existing task
export const updateTask = async (id, data) => {
    const response = await api.patch(`/tasks/${id}/`, data);
    return mapToTask(response.data);
};

// Delete a task
export const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}/`);
};
