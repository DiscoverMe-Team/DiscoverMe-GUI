import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfo } from '@/services/backend/UserService';

export function useUser() {
    const user = ref(null);
    const router = useRouter();

    async function fetchUserInfo() {
        try {
            const fetchedUser = await getUserInfo();
            user.value = fetchedUser;
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            router.push('/auth/login');
        }
    }

    return {
        user,
        fetchUserInfo,
    };
}
