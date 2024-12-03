<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted } from 'vue';
const { setPrimary } = useLayout();

onMounted(() => {
    // Set primary color to "violet" on app initialization
    setPrimary('violet');
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
