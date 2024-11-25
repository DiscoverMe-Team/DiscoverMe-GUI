<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { User } from '@/models/User'; // Import the User model
import { getUserInfo } from '@/services/backend/UserService'; // Import the service for fetching user info

// Layout controls
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

// State for profile dropdown visibility
const showProfileMenu = ref(false);

// Vue Router instance
const router = useRouter();

// User state using the User model
const user = ref(new User()); // Initialize an empty User instance

// Toggles the profile menu
function toggleProfileMenu() {
    showProfileMenu.value = !showProfileMenu.value;
}

// Closes the profile menu when clicking outside
function closeProfileMenu(event) {
    const dropdown = document.querySelector('.relative');
    if (dropdown && !dropdown.contains(event.target)) {
        showProfileMenu.value = false;
    }
}

// Fetch user information on mount
async function fetchUserInfo() {
    try {
        const fetchedUser = await getUserInfo();
        user.value = fetchedUser;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        router.push('/auth/login');
    }
}

onMounted(() => {
    document.addEventListener('click', closeProfileMenu);
    fetchUserInfo();
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

        <div class="layout-topbar-actions" style="padding-right: 0.5rem;">
            <!-- Profile Dropdown -->
            <div class="relative">
                <button
                    class="layout-topbar-action flex items-center gap-2"
                    @click="toggleProfileMenu"
                    aria-haspopup="true"
                    :aria-expanded="showProfileMenu"
                >
                    <i class="pi pi-user"></i>
                    <div class="profile-name">{{ user.username || 'User' }} </div>
                </button>
                <div
                    v-if="showProfileMenu"
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg sm:w-36"
                    role="menu"
                >
                    <ul role="menuitem">
                        <li>
                            <router-link
                                to="/settings"
                                class="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                active-class="bg-gray-200 dark:bg-gray-600"
                            >
                                <i class="pi pi-fw pi-cog"></i>
                                Settings
                            </router-link>
                        </li>
                        <li>
                            <button
                                @click="logout"
                                class="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <i class="pi pi-fw pi-sign-out"></i>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
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
}

.layout-topbar-logo-container {
    display: flex;
    align-items: center;
}

.layout-topbar-logo img {
    height: 3rem;
    margin-right: 0.5rem;
}

.layout-topbar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-right: 1rem; /* Add margin for proper spacing */
}

.layout-topbar-action {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--text-color);
    border-radius: 0.25rem;
    transition: background-color 0.3s ease, color 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.layout-topbar-action i {
    transition: color 0.2s ease-in-out;
}

.layout-topbar-action:hover {
    background-color: var(--surface-hover);
}

.layout-topbar-action:hover i {
    color: var(--primary-color);
}

.profile-container {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Space between icon and name */
    max-width: 150px; /* Limit maximum width to avoid overflow */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.profile-name {
    font-size: 0.875rem; /* Adjust font size for better fit */
    color: var(--text-color-secondary); /* Match theme */
    margin-left: 0.25rem;
}
</style>