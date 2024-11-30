<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Journal Entries', icon: 'pi pi-pencil', to: '/journal' },
            {label: 'Goal Setting', icon: 'pi pi-fw pi-check-square', to: '/goals'}
        ]
    },
    {
        label: 'Settings',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Account Management',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Change Information',
                        icon: 'pi pi-fw pi-info',
                        to: '/auth/updateinfo'
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/changepassword'
                    },
                ]
            },
            {
                label: 'E-mail Preferences',
                icon: 'pi pi-fw pi-envelope',
                to: '/pages/crud'
            },
        ]
    },
    
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
