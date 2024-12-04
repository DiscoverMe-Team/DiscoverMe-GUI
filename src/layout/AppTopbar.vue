<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { User } from '@/models/User'; 
import { getUserInfo } from '@/services/backend/UserService';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const showProfileMenu = ref(false);
const router = useRouter();
const user = ref(new User());
const currentDate = ref('');

// Toggles the profile menu
function toggleProfileMenu() {
    showProfileMenu.value = !showProfileMenu.value;
}

function closeProfileMenu(event) {
    const dropdown = document.querySelector('.relative');
    if (dropdown && !dropdown.contains(event.target)) {
        showProfileMenu.value = false;
    }
}

// Fetch user info
async function fetchUserInfo() {
    try {
        const fetchedUser = await getUserInfo();
        user.value = fetchedUser;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        router.push('/auth/login');
    }
}

// Format and set the current date
onMounted(() => {
    document.addEventListener('click', closeProfileMenu);
    fetchUserInfo();

    const date = new Date();
    currentDate.value = date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
});

onUnmounted(() => {
    document.removeEventListener('click', closeProfileMenu);
});

function logout() {
    localStorage.removeItem('accessToken');
    router.push('/home');
}
</script>


<template>
    <div class="layout-topbar bg-surface-2">
        <div class="layout-topbar-logo-container">
            <!-- Menu Toggle Button -->
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>

            <!-- Logo -->
            <router-link to="/" class="layout-topbar-logo">
                <img :src="isDarkTheme ? '/logo.png' : '/logo.png'" alt="DiscoverMe Logo" class="h-12" />
                <span>DiscoverMe</span>
            </router-link>
        </div>
        <div class="layout-topbar-date text-center text-lg font-medium hidden sm:block">
            {{ currentDate }}
        </div>
        <div class="layout-topbar-actions" style="padding-right: 0.5rem;">
            <!-- Profile Dropdown -->
            <div class="relative">
                <button
                    class="layout-topbar-action flex items-center gap-2"
                    @click="logout"
                    aria-haspopup="true"
                    :aria-expanded="showProfileMenu"
                >
                    <i style="color: red;"class="pi pi-fw pi-sign-out"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: var(--surface-card);
    border-bottom: 1px solid var(--surface-border);
    flex-wrap: wrap;
}

.layout-topbar-logo-container {
    display: flex;
    align-items: center;

}

.layout-topbar-logo img {
    height: 3rem;
    margin-right: 0.5rem;
}

.layout-topbar-date {
    flex-grow: 1;
    padding-right: 150px;
    text-align: center;
    color: var(--text-color-primary);
}

.layout-topbar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-right: 1rem;
}

@media (max-width: 640px) {
    .layout-topbar-date {
        display: none;     }

}
</style>
