
<script setup>
import { ref } from 'vue';
import { changePassword } from '@/services/backend/api'; // Abstracted API call

// Reactive variables for form inputs and messages
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const handleChangePassword = async () => {
    errorMessage.value = '';
    successMessage.value = '';

    // Validation: Check for blank fields
    if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
        errorMessage.value = 'All password fields are required.';
        return;
    }

    // Validation: Check if new password matches confirmation
    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = "New password and confirmation don't match.";
        return;
    }

    // Validation: Check minimum password length
    if (newPassword.value.length < 8) {
        errorMessage.value = 'New password must be at least 8 characters long.';
        return;
    }

    try {
        // Call the API to change the password
        await changePassword({
            current_password: currentPassword.value,
            new_password: newPassword.value,
        });

        // Handle successful password change
        successMessage.value = 'Password changed successfully.';
        errorMessage.value = '';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (error) {
        // Handle specific API error responses
        if (error.response?.status === 400) {
            errorMessage.value = error.response.data?.error || 'Current password is incorrect.';
        } else {
            errorMessage.value = 'An error occurred while changing your password.';
        }
        console.error('Change password error:', error);
    }
};
</script>

<style scoped>
.card {
    max-width: 600px;
    margin: auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background-color: #fff;
}

.form-group {
    margin-bottom: 1rem;
}

.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}


.btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: #c82333;
}
</style>

<template>
    <div class="card">
        <h1 class="font-semibold text-xl mb-4">Change Password</h1>
        <form @submit.prevent="handleChangePassword">
            <!-- Current Password -->
            <div class="form-group mb-4">
                <label for="currentPassword" class="block font-medium mb-2">Current Password</label>
                <input
                    id="currentPassword"
                    v-model="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    class="input"
                    required
                />
            </div>

            <!-- New Password -->
            <div class="form-group mb-4">
                <label for="newPassword" class="block font-medium mb-2">New Password</label>
                <input
                    id="newPassword"
                    v-model="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    class="input"
                    minlength="8"
                    required
                />
            </div>

            <!-- Confirm Password -->
            <div class="form-group mb-4">
                <label for="confirmPassword" class="block font-medium mb-2">Confirm Password</label>
                <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    class="input"
                    required
                />
            </div>

            <!-- Submit Button -->
            <Button
                label="Change Password"
                severity="danger"
                type="submit"
                class="btn p-button-danger w-full"
            />
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
        </form>
    </div>
</template>
