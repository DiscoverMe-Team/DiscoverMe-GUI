<script setup>
import { User } from '@/models/User'; 
import { getUserInfo } from '@/services/backend/UserService';
import { ref, onMounted, computed } from 'vue';
import { getMoods, getMoodById } from '@/services/backend/MoodService';
import { getMoodLogs } from '@/services/backend/MoodLogService';

const user = ref(new User());
const moods = ref([]);
const moodLogs = ref([]);
const showSetMoodDialog = ref(false);
const currentMood = ref(null); 
const currentEmoji = ref(null); 
const isLoading = ref(true);

const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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
                const moodDetails = await getMoodById(moodId);
                currentMood.value = moodDetails.mood_type;
                currentEmoji.value = moodDetails.emoji;
            } catch (error) {
                console.error('Failed to fetch current mood details:', error);
                currentMood.value = null;
            }
        }
    } catch (error) {
        console.error('Failed to fetch user info:', error);
    } finally {
        isLoading.value = false;
    }
}
async function handleMoodSave(moodLog) {
    isLoading.value = true; // Start loading
    try {
        // Update mood immediately for better user experience
        currentMood.value = moodLog.mood.mood_type;
        currentEmoji.value = moodLog.mood.emoji;

        // Fetch updated user info and mood logs
        await fetchUserInfo();
    } catch (error) {
        console.error('Error reloading dashboard data:', error);
        alert('Failed to refresh data. Please try reloading the page.');
    } finally {
        isLoading.value = false; // End loading
        showSetMoodDialog.value = false; // Close the dialog
    }
}

onMounted(() => {
    fetchUserInfo();
});
</script>

<template>
    <div class="profile">
        <!-- Skeleton loader when data is loading -->
        <template v-if="isLoading">
            <Skeleton shape="circle" size="100px" />
            <Skeleton height="20px" width="150px" class="mt-4" />
            <Skeleton height="20px" width="120px" class="mt-2" />
        </template>

        <!-- Profile content when data is loaded -->
        <template v-else>
            <img src="@/assets/umgc-logo.png" alt="Profile Picture" />
            <h3 class="layout-menuitem-text">{{ fullName }}</h3>
            <div class="status-bar" @click="showSetMoodDialog = true">
                <p v-if="currentMood">{{ currentMood }} {{ currentEmoji }}</p>
                <p v-else>How are you feeling?</p>
            </div>
        </template>

        <SetMood 
            v-if="showSetMoodDialog" 
            @close="showSetMoodDialog = false" 
            @save="handleMoodSave" 
        />
    </div>
</template>

<style scoped>
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
