<script setup>
import { ref, onMounted } from 'vue';
import { getMoods, getMoodById } from '@/services/backend/MoodService';
import { getMoodLogs } from '@/services/backend/MoodLogService';
import { getJournalEntries } from '@/services/backend/JournalEntryService';
import { getGoals } from '@/services/backend/GoalService';
import { getInsights } from '@/services/backend/InsightService';
import SetMood from '@/components/SetMood.vue'; // Import the SetMood component

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

// Fetch dashboard data on mount
onMounted(async () => {
    try {
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
    <div class="grid grid-cols-12 gap-8">
        <div v-if="errorMessage" class="col-span-12 text-red-500 text-center">
            {{ errorMessage }}
        </div>

        <!-- Mood Summary -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-3"  @click="showSetMoodDialog = true">
            <div class="card mb-0">
                <div class="text-center mb-4">
                    <h3>Current Mood</h3>
                    <div v-if="currentMood" class="text-xl">{{ currentMood }}</div>
                    <div v-else>No mood data available</div>
                </div>
            </div>
        </div>

        <!-- Recent Mood Logs -->
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <h3 class="mb-4">Recent Mood Logs</h3>
                <ul>
                    <li v-for="log in moodLogs.slice(0, 5)" :key="log.id">
                        <strong>{{ log.date_logged }}</strong> - {{ log.mood.mood_type }}: {{ log.notes || 'No notes' }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- Recent Journal Entries -->
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <h3 class="mb-4">Recent Journal Entries</h3>
                <ul>
                    <li v-for="entry in journalEntries.slice(0, 3)" :key="entry.id">
                        <strong>{{ entry.title }}</strong
                        >: {{ entry.content.substring(0, 100) }}...
                    </li>
                </ul>
            </div>
        </div>

        <!-- Active Goals -->
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <h3 class="mb-4">Active Goals</h3>
                <ul>
                    <li v-for="goal in goals.filter((goal) => !goal.completed)" :key="goal.id">{{ goal.title }} - {{ goal.description }}</li>
                </ul>
            </div>
        </div>

        <!-- Insights -->
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <h3 class="mb-4">Mood Insights</h3>
                <ul>
                    <li v-for="insight in insights.slice(0, 3)" :key="insight.id">{{ insight.trigger_word }} trends: {{ insight.mood_count }} occurrences in the last {{ insight.time_quantity }} {{ insight.time_frame }}</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- SetMood Component Modal -->
    <SetMood v-if="showSetMoodDialog" @close="showSetMoodDialog = false" @save="handleMoodSave" />
</template>
