<script setup>
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
        const response = await login({
            username: username.value,
            password: password.value
        });
        const { access, refresh } = response.data;
        saveTokens(access, refresh);
        router.push('/');
    } catch (error) {
        errorMessage.value = error.response?.data?.detail || 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
    }
};
</script>

<template>
    <div class=" bg-gradient bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"
            >
                <div class="w-full bg-surface-2  dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <!-- Center Logo -->
                    <div class="flex flex-col items-center text-center mb-8">
                        <img
                            :src="isDarkTheme ? '/logo.png' : '/logo.png'"
                            alt="DiscoverMe Logo"
                            class="h-20 w-auto mb-4"
                            style="max-width: 70px;"
                        />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Start your Journey!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <!-- Form -->
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
                            <router-link to="/auth/signup">
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


.login-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    text-align: center;
}
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
