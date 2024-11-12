<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { login } from '@/services/backend/api';
import { saveTokens } from '@/services/backend/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const checked = ref(false);
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
    errorMessage.value = '';

    try {
        // Send login request to the backend
        const response = await login({
            username: username.value, // Use `username` if your backend expects it instead of `email`
            password: password.value
        });

        // Extract access and refresh tokens from the response
        const { access, refresh } = response.data;

        // Save tokens to localStorage
        saveTokens(access, refresh);

        // Redirect to the dashboard after successful login
        router.push('/');
    } catch (error) {
        // Display an error message if the login fails
        errorMessage.value = error.response?.data?.detail || 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                        <InputText id="username1" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" v-model="username" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <router-link to="/signup">
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"> Sign-Up </span>
                            </router-link>
                        </div>

                        <Button label="Sign In" class="w-full" @click="handleLogin"></Button>
                        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
