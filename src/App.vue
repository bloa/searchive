<template>
  <app-navbar v-if="!hideNav" />
  <main>
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppNavbar from "./components/AppNavbar.vue";

const route = useRoute();
const hideNav = computed(() => route.meta.hideNav === true);
</script>
