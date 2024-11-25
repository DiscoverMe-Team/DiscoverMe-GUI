import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfo } from '@/services/backend/UserService';

export function useUser() {
    const user = ref(null); // Reactive user state
    const router = useRouter(); // Access Vue Router

    async function fetchUserInfo() {
        try {
            const fetchedUser = await getUserInfo();
            user.value = fetchedUser;
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            router.push('/auth/login'); // Redirect to login on error
        }
    }

    return {
        user,
        fetchUserInfo,
    };
}
