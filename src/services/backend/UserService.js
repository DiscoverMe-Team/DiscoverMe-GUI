import api from './api';
import { User } from '@/models/User';

// Map API response to a User instance
const mapToUser = (data) =>
    new User(
        data.id,
        data.username,
        data.email,
        data.first_name,
        data.last_name,
        data.occupation,
        data.city,
        data.state,
        data.pronouns,
        data.is_staff,
        data.is_superuser
    );

export const getUserInfo = async () => {
    try {
        const response = await api.get('/user-info/'); 
        return mapToUser(response.data);
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

// Update the user's information
export const updateUserInfo = async (user) => {
    try {
        const payload = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            occupation: user.occupation,
            city: user.city,
            state: user.state,
            pronouns: user.pronouns,
        };
        const response = await api.put('/auth/update-user/', payload);
        return response.data;
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
};

export const isFirstLogin = async () => {
    try {
        const response = await api.get('/user-info/'); // Adjust the endpoint as necessary
        const user = response.data;
        return !user?.first_name; // First login if first_name is blank or undefined
    } catch (error) {
        console.error('Error fetching user data:', error);
        return false; // Default to false in case of an error
    }
};