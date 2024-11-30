<script setup>
import { ref, computed, onMounted } from 'vue';
import { getMoods, getMoodById } from '@/services/backend/MoodService';
import { getMoodLogs } from '@/services/backend/MoodLogService';
import { getJournalEntries } from '@/services/backend/JournalEntryService';
import { getGoals } from '@/services/backend/GoalService';
import { getInsights } from '@/services/backend/InsightService';
import { fetchWeather } from '@/services/external/weatherService';
import { useUser } from '@/layout/composables/useUser';

// Dashboard data
const moods = ref([]);
const moodLogs = ref([]);
const journalEntries = ref([]);
const goals = ref([]);
const insights = ref([]);
const errorMessage = ref('');
const weather = ref(null);
const weatherError = ref('');
// Modal state for SetMood
const showSetMoodDialog = ref(false);
const currentMood = ref(null); // Stores the current mood for display
const { user, fetchUserInfo } = useUser();
const weatherIcons = {
    "clear sky": "pi pi-sun",
    "few clouds": "pi pi-cloud",
    "scattered clouds": "pi pi-cloud",
    "broken clouds": "pi pi-cloud",
    "shower rain": "pi pi-cloud-rain",
    "rain": "pi pi-cloud-rain",
    "thunderstorm": "pi pi-bolt",
    "snow": "pi pi-snowflake",
    "mist": "pi pi-fog",
};

const weatherIconClass = computed(() => {
    
    if (!weather.value || !weather.value.description) return "pi pi-question-circle"; // Default icon
    return weatherIcons[weather.value.description.toLowerCase()] || "pi pi-question-circle"; // Fallback
});

const weatherIconColor = computed(() => {
    if (!weather.value || !weather.value.description) return "text-gray-500"; // Default color
    const description = weather.value.description.toLowerCase();
    return description === "clear sky" ? "text-yellow-500" : "text-blue-500"; // Yellow for sunny, blue for others
});

// Fetch dashboard data
async function fetchDashboardData() {
    try {
        const [moodsResponse, moodLogsResponse, journalEntriesResponse, goalsResponse, insightsResponse] = await Promise.all([getMoods(), getMoodLogs(), getJournalEntries(), getGoals(), getInsights()]);

        moods.value = moodsResponse;
        moodLogs.value = moodLogsResponse;
        journalEntries.value = journalEntriesResponse;
        goals.value = goalsResponse;
        insights.value = insightsResponse;

        if (moodLogs.value.length > 0) {
            const moodId = moodLogs.value[0].mood;
            try {
                currentMood.value = (await getMoodById(moodId)).mood_type;
            } catch (error) {
                console.error('Failed to fetch current mood details:', error);
                currentMood.value = null;
            }
        }
    } catch (error) {
        errorMessage.value = 'Error fetching data. Please try again later.';
        console.error('Data Fetch Error:', error);
    }
}
onMounted(async () => {
    weatherError.value = '';
    try {
        await fetchDashboardData();
        await fetchUserInfo();
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
});

</script>

<template>
    <div class="row">
        <div class="dashboard-header flex justify-between items-center mb-6">
            <!-- Greeting Section -->
            <div class="greeting text-2xl font-semibold text-white">
                <Skeleton v-if="!user" width="200px" height="30px" />
                <span v-else>Hello, {{ user?.first_name || 'Guest' }}!</span>
            </div>


            <!-- Weather Section -->
            <div class="weather-info flex items-center gap-4 p-4">
                <div class="icon">
                    <i :class="[weatherIconClass, weatherIconColor]" class="text-4xl" style="font-size: 2rem;"></i>
                 </div>
                <div v-if="weather" class="weather-details">
                    <div class="temperature text-xl font-bold">{{ weather.temp }}°F</div>
                    <div class="location text-sm text-gray-500">{{ user.city }}, {{ user.state }}</div>
                </div>
                <div v-if="weatherError" class="text-red-500">{{ weatherError }}</div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            <!-- Recent Journal Entries -->
            <div class="dashboard-card">
                <div class="dashboard-card-header">
                    <i class="pi pi-pencil"></i>
                    <span>Recent Journal Entries</span>
                    <router-link to="/journal">
                        <i class="pi pi-plus add-icon"></i>
                    </router-link>
                </div>
                <div class="dashboard-card-body">
                    <ul v-if="journalEntries.length === 0">
                        <li v-for="n in 3" :key="n" class="mb-2">
                            <Skeleton width="90%" height="1rem" />
                        </li>
                    </ul>
                    <ul v-else>
                        <li v-for="entry in journalEntries.slice(0, 3)" :key="entry.id">
                            <strong>{{ entry.title }}</strong>: {{ entry.content.substring(0, 100) }}...
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Active Goals -->
            <div class="dashboard-card">
                <div class="dashboard-card-header">
                    <i class="pi pi-check-circle"></i>
                    <span>Active Goal</span>
                    <router-link to="/goals">
                        <i class="pi pi-plus add-icon"></i>
                    </router-link>
                </div>
                <div class="dashboard-card-body">
                    <ul v-if="goals.length === 0">
                        <li v-for="n in 3" :key="n" class="mb-2">
                            <Skeleton width="90%" height="1rem" />
                        </li>
                    </ul>
                    <ul v-else>
                        <li v-for="goal in goals.filter((goal) => !goal.completed)" :key="goal.id">
                            {{ goal.title }} - {{ goal.description }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
