<script setup>
import { register } from '@/services/backend/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { saveTokens } from '@/services/backend/auth';
import { User } from '@/models/User'; // Import your User class

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const validationErrors = ref({});
const router = useRouter();

const handleSignUp = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    validationErrors.value = {};

    // Validate inputs using the User class
    const fields = { username: username.value, email: email.value, password: password.value };
    const errors = User.validateAll(fields);

    if (password.value !== confirmPassword.value) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
        validationErrors.value = errors;
        return;
    }

    try {
        // Call the register API
        const response = await register({
            username: username.value,
            email: email.value,
            password: password.value,
        });

        // Save the returned tokens
        saveTokens(response.data.access, response.data.refresh);

        successMessage.value = "Sign-Up successful! Redirecting...";

        // Redirect to the dashboard or welcome page
        setTimeout(() => {
            router.push('/welcome');
        }, 2000);
    } catch (error) {
        const backendError = error.response?.data?.error;
        errorMessage.value = backendError || 'Registration failed. Please try again.';
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
                        <img src="/logo.png" alt="DiscoverMe Logo" class="h-20 w-auto mb-4" style="max-width: 70px;" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create Your Account</div>
                        <span class="text-muted-color font-medium">Sign up to get started</span>
                    </div>

                    <div>
                        <!-- Username -->
                        <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                        <InputText
                            id="username1"
                            type="text"
                            placeholder="Username"
                            class="w-full md:w-[30rem] mb-8"
                            :class="{ 'border-red-500': validationErrors.username }"
                            v-model="username"
                        />
                        <p v-if="validationErrors.username" class="error-text">{{ validationErrors.username }}</p>

                        <!-- Email -->
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText
                            id="email1"
                            type="email"
                            placeholder="Email address"
                            class="w-full md:w-[30rem] mb-8"
                            :class="{ 'border-red-500': validationErrors.email }"
                            v-model="email"
                        />
                        <p v-if="validationErrors.email" class="error-text">{{ validationErrors.email }}</p>

                        <!-- Password -->
                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password
                            id="password1"
                            v-model="password"
                            placeholder="Password"
                            :toggleMask="true"
                            class="mb-4"
                            fluid
                            :feedback="false"
                            :class="{ 'p-invalid': validationErrors.password }"
                        ></Password>
                        <p v-if="validationErrors.password" class="error-text">{{ validationErrors.password }}</p>

                        <!-- Confirm Password -->
                        <label for="confirmPassword1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirm Password</label>
                        <Password
                            id="confirmPassword1"
                            v-model="confirmPassword"
                            placeholder="Confirm Password"
                            :toggleMask="true"
                            class="mb-4"
                            fluid
                            :feedback="false"
                            :class="{ 'p-invalid': validationErrors.confirmPassword }"
                        ></Password>
                        <p v-if="validationErrors.confirmPassword" class="error-text">{{ validationErrors.confirmPassword }}</p>

                        <!-- Sign Up Button -->
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
