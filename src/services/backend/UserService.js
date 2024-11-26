import api from './api';
import { User } from '@/models/User';

const mapToUser = (data) =>
    new User(data.id, data.username, data.email, data.first_name, data.last_name, data.is_staff, data.is_superuser);

export const getUserInfo = async () => {
    try {
        const response = await api.get('/user-info/');
        return mapToUser(response.data);
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

