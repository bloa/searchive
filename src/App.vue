<template>
  <div id="app" class="min-h-screen bg-blue-50">
    <AppNavbar v-if="!hideNav" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppNavbar from "./components/AppNavbar.vue";

const route = useRoute();
const hideNav = computed(() => route.meta.hideNav === true);
</script>
