import { isAuthenticated } from '@/services/backend/auth';
import { isFirstLogin } from '@/services/backend/UserService';
import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                { path: '/', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
                { path: '/journal', name: 'journal', component: () => import('@/views/JournalEntry.vue') },
                { path: '/goals', name: 'goals', component: () => import('@/views/Goals.vue') },
                { path: '/auth/changepassword', name: 'changepassword', component: () => import('@/views/auth/ChangePassword.vue') },
                { path: '/auth/updateinfo', name: 'updateinfo', component: () => import('@/views/auth/UpdateInfo.vue') },
                { path: '/auth/email', name: 'email', component: () => import('@/views/EmailPreferences.vue') },
            ]
        },
        { path: '/welcome', name: 'welcome', component: () => import('@/views/auth/Welcome.vue') },
        { path: '/home', name: 'home', component: () => import('@/views/Landing.vue') },
        { path: '/auth/login', name: 'login', component: () => import('@/views/auth/Login.vue') },
        { path: '/auth/signup', name: 'signup', component: () => import('@/views/auth/SignUp.vue') },
        { path: '/auth/error', name: 'error', component: () => import('@/views/auth/Error.vue') },
        { path: '/:pathMatch(.*)*', name: 'catchAll', component: () => import('@/views/NotFound.vue') },
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/home'); // Redirect unauthenticated users to Landing Page
    } else if (isAuthenticated()) {
        try {
            const firstLogin = await isFirstLogin();
            // Redirect to Welcome Page if it's the user's first login
            if (firstLogin && to.name !== 'welcome') {
                next('/welcome');
            }
            // Prevent access to Welcome Page if it's not the first login
            else if (!firstLogin && to.name === 'welcome') {
                next('/');
            } else {
                next(); // Allow navigation
            }
        } catch (error) {
            console.error('Error determining first login:', error);
            next('/error'); // Optional error fallback
        }
    } else {
        next(); // Proceed for other cases
    }
});

export default router;
