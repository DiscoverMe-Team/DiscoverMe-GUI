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
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/journal',
                    name: 'journal',
                    component: () => import('@/views/JournalEntry.vue')
                },
                {
                    path: '/goals',
                    name: 'goals',
                    component: () => import('@/views/Goals.vue')
                },
                {
                    path: '/empty',
                    name: 'empty',
                    component: () => import('@/views/Empty.vue')
                },
                {
                    path: '/auth/changepassword',
                    name: 'changepassword',
                    component: () => import('@/views/auth/ChangePassword.vue')
                },
                {
                    path: '/auth/updateinfo',
                    name: 'updateinfo',
                    component: () => import('@/views/auth/UpdateInfo.vue')
                },
                {
                    path: '/auth/email',
                    name: 'email',
                    component: () => import('@/views/EmailPreferences.vue')
                }
            ]
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/Landing.vue')
        },
        {
            path: '/welcome',
            name: 'welcome',
            component: () => import('@/views/auth/Welcome.vue')
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/signup',
            name: 'SignUp',
            component: () => import('@/views/auth/SignUp.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/auth/Error.vue')
        },
        // Catch-all route for undefined paths
        {
            path: '/:pathMatch(.*)*',
            name: 'catchAll',
            component: () => import('@/views/NotFound.vue')

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
