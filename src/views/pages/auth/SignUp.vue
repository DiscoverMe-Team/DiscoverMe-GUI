<script setup>
import { register } from '@/services/backend/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

const handleSignUp = async () => {
    errorMessage.value = '';
    successMessage.value = '';

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        return;
    }

    try {
        await register({
            username: username.value,
            email: email.value,
            password: password.value
        });

        successMessage.value = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
            router.push('/auth/login');
        }, 2000);
    } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
    }
};
</script>

<template>
    
    <div class="bg-gradient bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-2  dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="flex flex-col items-center text-center mb-8">
                        
                        <img
                            :src="isDarkTheme ? '/logo.png' : '/logo.png'"
                            alt="DiscoverMe Logo"
                            class="h-20 w-auto mb-4"
                            style="max-width: 70px;"
                        />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create Your Account</div>
                        <span class="text-muted-color font-medium">Sign up to get started</span>
                    </div>

                    <div>
                        <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                        <InputText id="username1" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" v-model="username" />

                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="email" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <label for="confirmPassword1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirm Password</label>
                        <Password id="confirmPassword1" v-model="confirmPassword" placeholder="Confirm Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Button label="Sign Up" class="w-full" @click="handleSignUp"></Button>
                        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
                        <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
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
