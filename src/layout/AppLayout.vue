<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, ref, watch, onMounted } from 'vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const { layoutConfig, layoutState, isSidebarActive, resetMenu, setPrimary } = useLayout();

const outsideClickListener = ref(null);

// Watch for sidebar activation
watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

// Compute container classes for layout
const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

// Bind outside click listener for menu
function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                resetMenu();
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
}

// Check if the click was outside the menu
function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}

// Initialize primary color
onMounted(() => {
    if (!layoutConfig.primary) {
        console.log('Initializing primary color to "green".');
        setPrimary('violet'); // Set a default primary color
    } else {
        console.log('Primary color already set to:', layoutConfig.primary);
        applyPrimaryColor(layoutConfig.primary);
    }
});

// Watch for primary color changes
watch(
    () => layoutConfig.primary,
    (newPrimary) => {
        console.log('Primary color updated to:', newPrimary);
        applyPrimaryColor(newPrimary);
    }
);

// Update CSS variables for primary color
function applyPrimaryColor(colorName) {
    const primaryColor = getPrimaryColorPalette(colorName);
    if (primaryColor) {
        document.documentElement.style.setProperty('--primary-color', primaryColor[500]); // Set primary color
        console.log(`Primary color applied: ${primaryColor[500]}`);
    }
}

// Helper to fetch the primary color palette
function getPrimaryColorPalette(colorName) {
    const primaryColors = {
        green: { 500: '#22c55e' },
        blue: { 500: '#3b82f6' },
        orange: { 500: '#f97316' },
        // Add more colors as needed
    };

    return primaryColors[colorName] || null;
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>
