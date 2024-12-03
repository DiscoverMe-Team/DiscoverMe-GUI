<script setup>
import { User } from '@/models/User'; 
import { Mood } from '@/models/Mood';
import { MoodLog } from '@/models/MoodLog';
import { getUserInfo } from '@/services/backend/UserService';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getMoods, getMoodById } from '@/services/backend/MoodService';
import { getMoodLogs } from '@/services/backend/MoodLogService';

const user = ref(new User());
const moods = ref([]);
const moodLogs = ref([]);
const showSetMoodDialog = ref(false);
const currentMood = ref(null); 
const currentEmoji = ref(null); 

// Capitalization utility
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Computed full name with capitalization
const fullName = computed(() => {
    return `${capitalize(user.value.first_name)} ${capitalize(user.value.last_name)}`;
});


async function fetchUserInfo() {
    try {
        const fetchedUser = await getUserInfo();
        const moodsResponse = await getMoods();
        const moodLogsResponse = await getMoodLogs();
        user.value = fetchedUser;
        moods.value = moodsResponse;
        moodLogs.value = moodLogsResponse;

        if (moodLogs.value.length > 0) {
            const moodId = moodLogs.value[0].mood;
            try {
                currentMood.value = (await getMoodById(moodId)).mood_type;
                currentEmoji.value = (await getMoodById(moodId)).emoji;
            } catch (error) {
                console.error('Failed to fetch current mood details:', error);
                currentMood.value = null;
            }
        }
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        router.push('/auth/login');
    }
}
async function handleMoodSave(moodLog) {
    try {
        moodLogs.value.unshift(moodLog); // Optionally update local moodLogs immediately
        currentMood.value = moodLog.mood.mood_type; // Update the current mood display
        currentEmoji.value = moodLog.mood.emoji;
        await fetchUserInfo(); // Refresh all dashboard data
    } catch (error) {
        console.error('Error reloading dashboard data:', error);
        alert('Failed to refresh data. Please try reloading the page.');
    }
}
onMounted(() => {
    fetchUserInfo();
});

</script>

<style>
.profile{
    margin-bottom: 30px;
    text-align: center;
    
}

.profile img{
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 auto;
}

.profile h3{
    color: #000000;
    margin: 10px 0 5px;
    font-weight: 700;
}

.profile p{
    color: rgb(251, 251, 255);
    font-size: 14px;
}

.status-bar{
    cursor: pointer;
}

</style>

<template>
 <div class="profile">
                <img src="@/assets/umgc-logo.png" alt="profile_picture">
                <h3 class="layout-menuitem-text">{{ fullName }}</h3>
                <div class="status-bar" @click="showSetMoodDialog = true">
                    <p v-if="currentMood">{{ currentMood }} {{ currentEmoji }}</p>
                    <p v-else>No mood data available</p>

                </div>
                
            </div>
            <SetMood v-if="showSetMoodDialog" @close="showSetMoodDialog = false" @save="handleMoodSave" />
</template>