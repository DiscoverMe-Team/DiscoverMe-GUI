import AppLayout from '@/layout/AppLayout.vue';
import { isAuthenticated } from '@/services/backend/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/pages/Dashboard.vue')
                },
                {
                    path: '/journal',
                    name: 'journal',
                    component: () => import('@/views/pages/JournalEntry.vue')
                },
                {
                    path: '/goals',
                    name: 'goals',
                    component: () => import('@/views/pages/Goals.vue')
                }
            ]
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/pages/Landing.vue')
        },

        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/signup',
            name: 'SignUp',
            component: () => import('@/views/pages/auth/SignUp.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        // Catch-all route for undefined paths
        {
            path: '/:pathMatch(.*)*',
            name: 'catchAll',
            component: () => import('@/views/pages/NotFound.vue')

        }
    ]
});

router.beforeEach((to, from, next) => {
    // If a route requires authentication and the user is not authenticated
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/home'); // Redirect unauthenticated users to Landing Page
    }
    // If the user is authenticated and tries to access the Landing Page, redirect to Dashboard
    else if (to.name === 'home' && isAuthenticated()) {
        next('/'); // Redirect authenticated users to the Dashboard
    } else {
        next(); // Proceed to the route
    }
});

export default router;
