<template>
  <div id="app" class="min-h-screen">
    <!-- Barre de navigation globale (masquée sur les écrans de formulaire) -->
    <AppNavbar v-if="!hideNav" />
    <!-- Zone d'affichage des pages -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppNavbar from "./components/AppNavbar.vue";
import { useLocalStorage } from "./store/localStorage";

const route = useRoute();
const hideNav = computed(() => route.meta.hideNav === true);

// Pas besoin d'import supplémentaire
// useLocalStorage().fillTestData();
</script>
