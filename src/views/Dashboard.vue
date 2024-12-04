<script setup>
/**
 * Dashboard Component Script
 *
 * This script handles the logic for displaying the user's dashboard, including:
 * - Fetching and displaying user data
 * - Showing a greeting with a brief suggestion/affirmation
 * - Displaying the latest journal entry, active goals, and daily affirmation
 * - Fetching weather information for the user
 * - Fetching suggestions for user improvement
 */

import { ref, computed, onMounted } from 'vue';
import { getMoods, getMoodById } from '@/services/backend/MoodService';
import { getMoodLogs } from '@/services/backend/MoodLogService';
import { getJournalEntries } from '@/services/backend/JournalEntryService';
import { getGoals } from '@/services/backend/GoalService';
import { getInsights } from '@/services/backend/InsightService';
import { fetchWeather } from '@/services/external/weatherService';
import { useUser } from '@/layout/composables/useUser';
import { getRandomAffirmation } from '@/services/backend/affirmations';
import { getSuggestions } from '@/services/backend/SuggestionService';

// Reactive data variables
const moods = ref([]);
const moodLogs = ref([]);
const latestJournalEntry = ref(null);
const goals = ref([]);
const insights = ref([]);
const errorMessage = ref('');
const weather = ref(null);
const weatherError = ref('');
const dailyAffirmation = ref('');
const showSetMoodDialog = ref(false);
const currentMood = ref(null);
const { user, fetchUserInfo } = useUser();
const suggestion = ref('');
const showGreeting = ref(true);
const suggestionsError = ref('');
const loadingSuggestions = ref(false);

// Mapping for weather icons
const weatherIcons = {
    'clear sky': 'pi pi-sun',
    'few clouds': 'pi pi-cloud',
    'scattered clouds': 'pi pi-cloud',
    'broken clouds': 'pi pi-cloud',
    'shower rain': 'pi pi-cloud-rain',
    rain: 'pi pi-cloud-rain',
    thunderstorm: 'pi pi-bolt',
    snow: 'pi pi-snowflake',
    mist: 'pi pi-fog',
};
// Reactive data variables
const greeting = ref('Hello, welcome back!');

// Utility function to format a date into a readable format (e.g., "March 5, 2024")
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const suggestions = ref([
    { id: 1, text: 'Create a goal: Go for a walk', completed: false },
    { id: 2, text: 'Journal how your day is going', completed: false },
    { id: 3, text: 'Watch a guided meditation video', completed: false },
]);

/**
 * Handles the completion of a suggestion.
 * Updates the greeting text with a cheerful message.
 */
const completeSuggestion = (id) => {
    const suggestion = suggestions.value.find((s) => s.id === id);
    if (suggestion) {
        suggestion.completed = true;
        greeting.value = `Great job completing: "${suggestion.text}" 🎉 Keep it up!`;
    }
};
// Utility function to capitalize the first letter of a string
const capitalize = (str) => {
    if (!str) return 'Guest';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Fetches suggestions for the user and updates the state.
 */
const fetchSuggestions = async () => {
    loadingSuggestions.value = true;
    suggestionsError.value = '';
    try {
        suggestions.value = await getSuggestions();
    } catch (error) {

        console.error('Suggestions Fetch Error:', error);
    } finally {
        loadingSuggestions.value = false;
    }
};

/**
 * Handles the transition to show a suggestion briefly before reverting to the greeting.
 */
const displaySuggestionBriefly = () => {
    showGreeting.value = false;
    setTimeout(() => {
        showGreeting.value = true;
    }, 5000);
};

// Computed property for determining the weather icon class
const weatherIconClass = computed(() => {
    if (!weather.value || !weather.value.description) return 'pi pi-question-circle'; // Default icon
    return weatherIcons[weather.value.description.toLowerCase()] || 'pi pi-question-circle'; // Fallback
});

// Computed property for determining the weather icon color
const weatherIconColor = computed(() => {
    if (!weather.value || !weather.value.description) return 'text-gray-500'; // Default color
    const description = weather.value.description.toLowerCase();
    return description === 'clear sky' ? 'text-yellow-500' : 'text-blue-500'; // Yellow for sunny, blue for others
});

/**
 * Retrieve or generate the daily affirmation.
 * Uses localStorage to persist the affirmation for the day.
 */
const getDailyAffirmation = () => {
    const savedAffirmation = JSON.parse(localStorage.getItem('dailyAffirmation'));
    const today = new Date().toISOString().split('T')[0];

    if (savedAffirmation && savedAffirmation.date === today) {
        return savedAffirmation.affirmation;
    }

    const newAffirmation = getRandomAffirmation();
    localStorage.setItem('dailyAffirmation', JSON.stringify({ affirmation: newAffirmation, date: today }));
    return newAffirmation;
};

/**
 * Fetches and updates the dashboard data, including moods, journal entries, goals, insights, and suggestions.
 */
async function fetchDashboardData() {
    try {
        const [moodsResponse, moodLogsResponse, journalEntriesResponse, goalsResponse, insightsResponse] = await Promise.all([
            getMoods(),
            getMoodLogs(),
            getJournalEntries(),
            getGoals(),
            getInsights(),
        ]);

        moods.value = moodsResponse;
        moodLogs.value = moodLogsResponse;
        goals.value = goalsResponse;
        insights.value = insightsResponse;

        goals.value = goalsResponse.map((goal) => ({
            ...goal,
            formattedDate: formatDate(goal.start_date),
        }));

        // Set the latest journal entry
        latestJournalEntry.value = journalEntriesResponse.length > 0 ? journalEntriesResponse[0] : null;
    } catch (error) {
        errorMessage.value = 'Error fetching data. Please try again later.';
        console.error('Data Fetch Error:', error);
    }
}

// On component mount, fetch data and initialize state
onMounted(async () => {
    weatherError.value = '';
    dailyAffirmation.value = getDailyAffirmation();
    suggestion.value = getRandomAffirmation(); // Use affirmation as the suggestion

    try {
        await fetchDashboardData();
        await fetchUserInfo();
        await fetchSuggestions(); // Fetch suggestions

        if (!user.value?.city || !user.value?.state) {
            weatherError.value = 'City and state are required for weather information.';
            return;
        }

        const weatherData = await fetchWeather(user.value.city, user.value.state);
        weather.value = {
            temp: weatherData.main.temp,
            description: weatherData.weather[0].description,
        };
    } catch (error) {
        weatherError.value = 'Failed to fetch weather. Please try again later.';
        console.error('Weather Fetch Error:', error);
    }

    greeting.value = `Hello, ${capitalize(user.value?.first_name)}`;
    setTimeout(() => {
        displaySuggestionBriefly();
    }, 3000);
});
</script>


<template>
    <div class="row">
        <div class="dashboard-header flex justify-between items-center mb-6">
            <!-- Greeting Section -->
            <div class="greeting text-2xl font-semibold text-white fade-transition">
                <Skeleton v-if="!user" width="200px" height="30px" />
                <span v-else>{{ showGreeting ? greeting : suggestion }}</span>
            </div>

            <!-- Weather Section -->
            <div class="weather-info flex items-center gap-4 p-4">
                <div class="icon">
                    <i :class="[weatherIconClass, weatherIconColor]" class="text-4xl" style="font-size: 2rem"></i>
                </div>
                <div v-if="weather" class="weather-details">
                    <div class="temperature text-xl font-bold">{{ weather.temp }}°F</div>
                    <div class="location text-sm text-gray-500">{{ user.city }}, {{ user.state }}</div>
                </div>
                <div v-if="weatherError" class="text-red-500">{{ weatherError }}</div>
            </div>
        </div>

        <!-- Suggestions Section -->
        <div class="card bg-blue-100 text-blue-900 p-4 rounded shadow-md">
            <h2 class="text-lg mb-2"><i>Suggestions for You</i></h2>
            <ul class="suggestions-list">
                <li v-for="suggestion in suggestions" :key="suggestion.id" class="suggestion-item">
                    <label>
                        <input type="checkbox" :disabled="suggestion.completed"
                            @change="completeSuggestion(suggestion.id)" />
                        {{ suggestion.text }}
                    </label>
                </li>
            </ul>
        </div>


        <div class="grid grid-cols-1 md:grid-cols-2  gap-8">
            <!-- Recent Journal Entries -->
            <div class="dashboard-card">
                <div class="dashboard-card-header flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-pencil text-blue-600 text-xl"></i>
                        <span class="font-semibold text-lg">Recent Journal Entry</span>
                    </div>
                    <router-link to="/journal" class="text-blue-500 hover:text-blue-700 transition">
                        <i class="pi pi-plus-circle text-lg"></i> Add Entry
                    </router-link>
                </div>
                <div class="dashboard-card-body">
                    <!-- No Journal Entries -->
                    <div v-if="!latestJournalEntry" class="text-gray-500 text-sm">
                        <p>Nothing written yet. <router-link to="/journal"
                                class="text-blue-500 underline hover:text-blue-700 transition">Start your first
                                entry</router-link> now!</p>
                    </div>

                    <!-- Latest Journal Entry -->
                    <div v-else class="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                        <h3 class="font-semibold text-base text-gray-800">{{ latestJournalEntry.title }}</h3>
                        <p class="text-sm text-gray-600 mt-2 line-clamp-3">{{ latestJournalEntry.content }}</p>
                        <router-link to="/journal"
                            class="text-blue-500 text-sm mt-4 inline-block hover:text-blue-700 transition">
                            Read More
                        </router-link>
                    </div>
                </div>
            </div>


            <!-- Active Goals -->
            <div class="dashboard-card">
                <div class="dashboard-card-header flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-green-600 text-xl"></i>
                        <span class="font-semibold text-lg">Active Goals</span>
                    </div>
                    <router-link to="/goals" class="text-blue-500 hover:text-blue-700 transition">
                        <i class="pi pi-plus-circle text-lg"></i> Add Goal
                    </router-link>
                </div>
                <div class="dashboard-card-body">
                    <!-- No Active Goals -->
                    <div v-if="goals.filter((goal) => !goal.completed).length === 0" class="text-gray-500 text-sm">
                        <p>No active goals yet. <router-link to="/goals"
                                class="text-blue-500 underline hover:text-blue-700 transition">Set a new
                                goal</router-link> and start your journey!</p>
                    </div>

                    <!-- Active Goals List -->
                    <ul v-else class="space-y-4">
                        <li v-for="goal in goals.filter((goal) => !goal.completed)" :key="goal.id"
                            class="flex items-start bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                            <div class="flex flex-col">
                                <span class="font-semibold text-base text-gray-800">{{ goal.title }}</span>
                                <span class="text-sm text-gray-500">Start Date: {{ goal.formattedDate }}</span>
                            </div>
                            <i class="pi pi-arrow-right ml-auto text-gray-400 text-lg"></i>
                        </li>
                    </ul>
                </div>
            </div>


        </div>
    </div>
</template>

<style scoped>
.daily-affirmation {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    font-family: 'Arial, sans-serif';
}

.fade-transition {
    transition: opacity 0.5s ease-in-out;
}
</style>
