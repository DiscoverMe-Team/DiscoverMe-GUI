
<script setup>
import { ref, onMounted } from 'vue';
import { getUserInfo, updateUserDetails } from '@/services/backend/api'; // Centralized API methods
import { fetchWeather } from '@/services/external/weatherService'; 
import { validateCityStateWithOSM } from '@/services/external/OpenStreetMapService';
import { states } from '@/models/States';

// Reactive variables for form inputs and messages
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const occupation = ref('');
const city = ref('');
const state = ref('');
const pronouns = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const showValidation = ref(false);

// Fetch user details when the component is mounted
const fetchUserDetails = async () => {
    try {
        const response = await getUserInfo();
        const user = response.data;

        // Set reactive variables
        firstName.value = user.first_name || '';
        lastName.value = user.last_name || '';
        email.value = user.email || '';
        occupation.value = user.occupation || '';
        city.value = user.city || '';
        state.value = user.state || '';
        pronouns.value = user.pronouns || '';
    } catch (error) {
        errorMessage.value = 'Failed to fetch user details.';
        console.error('Failed to fetch user details:', error);
    }
};

// Update user details
const handleUpdateUser = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    showValidation.value = true;

    // Validate required fields
    if (!firstName.value || !lastName.value || !email.value) {
        errorMessage.value = 'Please fill out all required fields.';
        return;
    }

        // Validate City and State
    const isCityStateValid = await validateCityState(city.value, state.value);
    if (!isCityStateValid) {
        errorMessage.value = 'Invalid city and state combination.';
        return;
    }

    try {
        await updateUserDetails({
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            occupation: occupation.value,
            city: city.value,
            state: state.value,
            pronouns: pronouns.value,
        });

        successMessage.value = 'User details updated successfully.';
    } catch (error) {
        errorMessage.value =
            error.response?.data?.error || 'An error occurred while updating your details.';
        console.error('Update user error:', error);
    }
};

const validateCityState = async (city, state) => {
    const isValid = await validateCityStateWithOSM(city, state);
    if (isValid) {
        console.log(`${city}, ${state} is a valid city and state combination.`);
        return true;
    } else {
        console.error(`${city}, ${state} is not a valid city and state combination.`);
        return false;
    }
};


// Fetch user details on mount
onMounted(fetchUserDetails);
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

.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}

.input.invalid {
    border-color: red;
    background-color: #ffe6e6;
}

.btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: #218838;
}
</style>

<template>
    <div class="card">
        <h1 class="font-semibold text-xl mb-4">Update User Details</h1>
        <form @submit.prevent="handleUpdateUser">
            <!-- First Name -->
            <div class="form-group mb-4">
                <label for="firstName" class="block font-medium mb-2">First Name</label>
                <input
                    id="firstName"
                    v-model="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    class="input"
                    :class="{ invalid: !firstName && showValidation }"
                />
            </div>

            <!-- Last Name -->
            <div class="form-group mb-4">
                <label for="lastName" class="block font-medium mb-2">Last Name</label>
                <input
                    id="lastName"
                    v-model="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    class="input"
                    :class="{ invalid: !lastName && showValidation }"
                />
            </div>

            <!-- Email -->
            <div class="form-group mb-4">
                <label for="email" class="block font-medium mb-2">Email</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    class="input"
                    :class="{ invalid: !email && showValidation }"
                />
            </div>

            <!-- Occupation -->
            <div class="form-group mb-4">
                <label for="occupation" class="block font-medium mb-2">Occupation</label>
                <input
                    id="occupation"
                    v-model="occupation"
                    type="text"
                    placeholder="Enter your occupation"
                    class="input"
                />
            </div>

            <!-- City -->
            <div class="form-group mb-4">
                <label for="city" class="block font-medium mb-2">City</label>
                <input
                    id="city"
                    v-model="city"
                    type="text"
                    placeholder="Enter your city"
                    class="input"
                />
            </div>

            <!-- State -->
            <div class="form-group mb-4">
                <label for="state" class="block font-medium mb-2">State</label>
                <select
                    id="state"
                    v-model="state"
                    class="input"
                    :class="{ invalid: (!state || errorMessage.includes('state')) && showValidation }"
                >
                    <option value="" disabled>Select a state</option>
                    <option v-for="stateOption in states" :key="stateOption.abbreviation" :value="stateOption.abbreviation">
                        {{ stateOption.name }}
                    </option>
                </select>
            </div>

            <!-- Pronouns -->
            <div class="form-group mb-4">
                <label for="pronouns" class="block font-medium mb-2">Pronouns</label>
                <input
                    id="pronouns"
                    v-model="pronouns"
                    type="text"
                    placeholder="Enter your pronouns (e.g., He/Him, She/Her)"
                    class="input"
                />
            </div>

            <!-- Submit Button -->
            <Button label="Update Details" severity="success" type="submit" class="btn w-full" />
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
        </form>
    </div>
</template>
