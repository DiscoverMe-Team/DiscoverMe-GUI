<script setup>
import { ref } from 'vue';

// State for user preferences
const emailPreferences = ref({
    newsletters: true,
    updates: true,
    moodTrackingReminders: false,
    journalingTips: false,
});

// Handle preference change
const updatePreference = (key) => {
    emailPreferences.value[key] = !emailPreferences.value[key];
    // Mock API call to save preferences
    console.log(`Updated ${key}:`, emailPreferences.value[key]);
};

const savePreferences = () => {
    // Simulate saving preferences
    console.log('Preferences saved:', emailPreferences.value);
    alert('Your preferences have been updated!');
};
</script>

<template>
    <div class="flex flex-col items-center py-12">
        <div class="card shadow-lg rounded-lg p-8 w-full max-w-2xl">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Email Preferences</h2>
            <p class="text-gray-600 mb-4">
                Manage your email preferences. Select the types of emails you'd like to receive from us.
            </p>

            <div class="space-y-4">
                <!-- Newsletters -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Newsletters</span>
                    <label class="switch">
                        <input
                            type="checkbox"
                            v-model="emailPreferences.newsletters"
                            @change="updatePreference('newsletters')"
                        />
                        <span class="slider round"></span>
                    </label>
                </div>

                <!-- Product Updates -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Product Updates</span>
                    <label class="switch">
                        <input
                            type="checkbox"
                            v-model="emailPreferences.updates"
                            @change="updatePreference('updates')"
                        />
                        <span class="slider round"></span>
                    </label>
                </div>

                <!-- Mood Tracking Reminders -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Mood Tracking Reminders</span>
                    <label class="switch">
                        <input
                            type="checkbox"
                            v-model="emailPreferences.moodTrackingReminders"
                            @change="updatePreference('moodTrackingReminders')"
                        />
                        <span class="slider round"></span>
                    </label>
                </div>

                <!-- Journaling Tips -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Journaling Tips</span>
                    <label class="switch">
                        <input
                            type="checkbox"
                            v-model="emailPreferences.journalingTips"
                            @change="updatePreference('journalingTips')"
                        />
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <!-- Save Button -->
            <button
                @click="savePreferences"
                class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
                Save Preferences
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Toggle Switch */
.switch {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #4caf50;
}

input:checked + .slider:before {
    transform: translateX(18px);
}
</style>
