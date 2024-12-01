<script setup>

import SetMood from '@/components/SetMood.vue'; // Import the SetMood component
import { useUser } from '@/layout/composables/useUser';
import { getGoals } from '@/services/backend/GoalService';
import { getInsights } from '@/services/backend/InsightService';
import { getJournalEntries } from '@/services/backend/JournalEntryService';
import { getMoodLogs } from '@/services/backend/MoodLogService';
import { getMoodById, getMoods } from '@/services/backend/MoodService';
import { onMounted, ref } from 'vue';


// Dashboard data
const moods = ref([]);
const moodLogs = ref([]);
const journalEntries = ref([]);
const goals = ref([]);
const insights = ref([]);
const errorMessage = ref('');
// Modal state for SetMood
const showSetMoodDialog = ref(false);
const currentMood = ref(null); // Stores the current mood for display
const { user, fetchUserInfo } = useUser();
// Fetch dashboard data on mount
onMounted(async () => {
    try {
        fetchUserInfo();
        await fetchDashboardData();
    } catch (error) {
        errorMessage.value = 'Failed to load dashboard data.';
        console.error('Dashboard Error:', error);
    }
});

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

async function handleMoodSave(moodLog) {
    try {
        moodLogs.value.unshift(moodLog); // Optionally update local moodLogs immediately
        currentMood.value = moodLog.mood.mood_type; // Update the current mood display
        await fetchDashboardData(); // Refresh all dashboard data
    } catch (error) {
        console.error('Error reloading dashboard data:', error);
        alert('Failed to refresh data. Please try reloading the page.');
    }
}
</script>

<template>
    <div class="row">
        <div class="dashboard-header flex justify-between items-center mb-6">
        <!-- Greeting Section -->
        <div class="greeting text-2xl font-semibold text-white">
            Hello, {{ user?.username || 'Guest' }}!
        </div>

        <!-- Weather Section -->
        <div class="weather-info flex items-center gap-4 p-4">
            <div class="icon">
                <i class="pi pi-cloud text-4xl text-blue-500"></i>
            </div>
            <div class="weather-details">
                <div class="temperature text-xl font-bold">75°F</div>
                <div class="location text-sm text-gray-500">New York, NY</div>
            </div>
        </div>
    </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div class="dashboard-card" @click="showSetMoodDialog = true">
            <div class="dashboard-card-header">
                <i class="pi pi-heart-fill"></i>
                Current Mood
            </div>
            <div class="dashboard-card-body text-center mb-10">
                <p>
                <div v-if="currentMood" class="text-xl">{{ currentMood }}</div>
                <div v-else>No mood data available</div>
                </p>
            </div>
        </div>

        <div class="dashboard-card" @click="$router.push('/journal')" style="cursor: pointer;" title="Click to view all journal entries">
            <div class="dashboard-card-header">
                <i class="pi pi-pencil"></i>
                Recent Journal Entries
            </div>
            <div class="dashboard-card-body">
                <ul>
                    <li v-for="entry in journalEntries.slice(0, 3)" :key="entry.id">
                        <strong>{{ entry.title }}</strong>: {{ entry.content.substring(0, 100) }}...
                    </li>
                </ul>
            </div>
        </div>

        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <i class="pi pi-check-circle"></i>
                Active Goal
            </div>
            <div class="dashboard-card-body">
                <ul>
                    <li v-for="goal in goals.filter((goal) => !goal.completed)" :key="goal.id">
                        {{ goal.title }} - {{ goal.description }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <SetMood v-if="showSetMoodDialog" @close="showSetMoodDialog = false" @save="handleMoodSave" />
</template>
