<script setup>
import { ref } from 'vue';

// State for user preferences (no actual changes or saving logic)
const emailPreferences = ref({
    newsletters: false,
    updates: false,
    moodTrackingReminders: false,
    journalingTips: false,
});

const togglePreference = (key) => {
    console.log(`Switch toggled for: ${key}`);
};
</script>

<template>
    <div class="flex flex-col items-center py-12">
        <div class="card shadow-lg rounded-lg p-8 w-full max-w-2xl">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Email Preferences</h2>
            <p class="text-gray-600 mb-4">
                Manage your email preferences. These switches are currently not functional.
            </p>

            <div class="space-y-4">
                <!-- Newsletters -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Newsletters</span>
                    <label class="switch">
                        <input
                            type="checkbox"
                            @change="togglePreference('newsletters')"
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
                            @change="togglePreference('updates')"
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
                            @change="togglePreference('moodTrackingReminders')"
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
                            @change="togglePreference('journalingTips')"
                        />
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <!-- Save Button -->
            <Button
                class="mt-6 text-white px-4 py-2 rounded-lg shadow cursor-not-allowed"
                
            >
                Save Preferences 
            </Button>
        </div>
    </div>
</template>

<style scoped>
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
