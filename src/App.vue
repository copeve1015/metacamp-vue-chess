<script setup>
import { RouterView } from 'vue-router'
import NavigationMenu from '@/components/nav/NavigationMenu.vue'
</script>

<template>
  <header>
    <NavigationMenu />
  </header>
  <RouterView />
</template>

<style scoped></style>
