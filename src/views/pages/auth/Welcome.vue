<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { updateUserDetails } from '@/services/backend/api';
import { states } from '@/models/States'; 

const stage = ref(1);
const firstName = ref('');
const lastName = ref('');
const city = ref('');
const state = ref('');
const occupation = ref('');
const pronouns = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleNextStage = () => {
    if (!isStageValid()) return;
    if (stage.value === 1) stage.value = 2;
    else if (stage.value === 2) stage.value = 3;
    else handleCompleteSignUp();
};

const isStageValid = () => {
    if (stage.value === 2 && (!firstName.value || !lastName.value)) {
        errorMessage.value = 'Please provide your first and last name.';
        return false;
    }
    if (stage.value === 3 && (!city.value || !state.value || !occupation.value || !pronouns.value)) {
        errorMessage.value = 'Please fill in all fields.';
        return false;
    }
    errorMessage.value = '';
    return true;
};

const handleCompleteSignUp = async () => {
    try {
        await updateUserDetails({
            first_name: firstName.value,
            last_name: lastName.value,
            city: city.value,
            state: state.value,
            occupation: occupation.value,
            pronouns: pronouns.value,
        });

        successMessage.value = 'Registration complete! Redirecting to dashboard...';
        setTimeout(() => {
            router.push('/');
        }, 2000);
    } catch (error) {
        console.error('Update user details error:', error);
        errorMessage.value = 'An error occurred while updating your details. Please try again.';
    }
};
</script>

<template>
    <div class="bg-gradient min-h-screen flex items-center justify-center bg-gray-100">
        <div class="text-center">
            <!-- Greeting -->
            <div v-if="stage === 1" class="animate-fade-in">
                <h1 class="text-4xl font-bold mb-6 text-white">Hello, friend!</h1>
                <p class="text-lg text-white">We’re excited to have you on board.</p>
                <Button @click="handleNextStage" class="mt-6 bg-blue-500 text-white px-6 py-2 rounded">
                    Next
                </Button>
            </div>

            <!-- Name Input -->
            <div v-else-if="stage === 2" class="animate-fade-in">
                <h1 class="text-2xl font-bold mb-6 text-white">Tell us your name</h1>
                <input
                    v-model="firstName"
                    type="text"
                    placeholder="First Name"
                    class="block w-full px-4 py-2 mb-4 border rounded"
                />
                <input
                    v-model="lastName"
                    type="text"
                    placeholder="Last Name"
                    class="block w-full px-4 py-2 mb-4 border rounded"
                />
                <Button @click="handleNextStage" class="mt-4 bg-blue-500 text-white px-6 py-2 rounded">
                    Next
                </Button>
            </div>

            <!-- Final Details -->
            <div v-else-if="stage === 3" class="animate-fade-in">
                <h1 class="text-2xl font-bold mb-6 text-white">A few more details</h1>
                <input
                    v-model="city"
                    type="text"
                    placeholder="City"
                    class="block w-full px-4 py-2 mb-4 border rounded"
                />
                <select v-model="state" class="block w-full px-4 py-2 mb-4 border rounded">
                    <option value="" disabled>Select your state</option>
                    <option v-for="stateOption in states" :key="stateOption.abbreviation" :value="stateOption.abbreviation">
                        {{ stateOption.name }}
                    </option>
                </select>
                <input
                    v-model="occupation"
                    type="text"
                    placeholder="Occupation"
                    class="block w-full px-4 py-2 mb-4 border rounded"
                />
                <select v-model="pronouns" class="block w-full px-4 py-2 mb-4 border rounded">
                    <option value="" disabled>Select pronouns</option>
                    <option value="he/him">He/Him</option>
                    <option value="she/her">She/Her</option>
                    <option value="they/them">They/Them</option>
                    <option value="prefer not to say">Prefer not to say</option>
                </select>
                <Button @click="handleCompleteSignUp" class="mt-4 bg-green-500 text-white px-6 py-2 rounded">
                    Complete Signup
                </Button>
            </div>

            <!-- Success Message -->
            <p v-if="successMessage" class="mt-6 text-green-500">{{ successMessage }}</p>
            <p v-if="errorMessage" class="mt-6 text-red-500">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fade-in 1.5s ease-in-out;
}
</style>
