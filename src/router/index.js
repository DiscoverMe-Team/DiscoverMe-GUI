import { createRouter, createWebHistory } from 'vue-router'; // Import the necessary functions from Vue Router
import HomePage from '@/views/HomePage.vue'; // Import your components
import MoodTracker from '@/views/MoodTracker.vue';
import UserGoals from '@/views/UserGoals.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage, // Map the root path to the HomePage component
  },
  {
    path: '/mood-tracker',
    name: 'MoodTracker',
    component: MoodTracker, // Map /mood-tracker to the MoodTracker component
  },
  {
    path: '/goals',
    name: 'Goals',
    component: UserGoals, // Map /goals to the UserGoals component
  },
];

const router = createRouter({
  history: createWebHistory(), // Use the HTML5 History API for cleaner URLs (without #)
  routes, // Pass in the routes array
});

export default router; // Export the router to be used in main.js
