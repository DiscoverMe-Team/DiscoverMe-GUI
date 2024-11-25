import api from './api';
import { User } from '@/models/User';

// Map API response to a User instance
const mapToUser = (data) =>
    new User(data.id, data.username, data.email, data.first_name, data.last_name, data.is_staff, data.is_superuser);

// Fetch the currently authenticated user's info
export const getUserInfo = async () => {
    try {
        const response = await api.get('/user-info/'); // Adjust the endpoint if needed
        return mapToUser(response.data);
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

// Additional user-related API methods can be added here if needed
