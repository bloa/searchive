<!-- components/AppNavbar.vue -->
<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Brand and navigation -->
      <div class="flex h-16 items-center">

        <!-- Brand: left -->
        <router-link to="/" class="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            S
          </span>
          <span class="hidden sm:inline">Searchive</span>
        </router-link>

        <!-- Desktop navigation: right -->
        <div class="hidden md:flex items-center gap-2 ml-auto">
          <router-link v-for="link in links" :key="link.to" :to="link.to"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors" :class="isActive(link.to)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'" :aria-current="isActive(link.to) ? 'page' : undefined">
            <font-awesome-icon :icon="link.icon" />
            {{ link.label }}
          </router-link>
        </div>

        <!-- Mobile menu button: right -->
        <button type="button" class="ml-auto md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          :aria-expanded="open" aria-controls="mobile-navigation" aria-label="Ouvrir le menu" @click="open = !open">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile navigation: right-aligned -->
      <div v-if="open" id="mobile-navigation" class="flex flex-col items-end gap-1 pb-4 md:hidden">
        <router-link v-for="link in links" :key="link.to" :to="link.to" class="px-4 py-2 rounded-lg text-sm font-medium"
          :class="isActive(link.to)
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'" :aria-current="isActive(link.to) ? 'page' : undefined">
          <font-awesome-icon :icon="link.icon" />
          {{ link.label }}
        </router-link>
      </div>

    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChartLine, faClipboardList, faList } from "@fortawesome/free-solid-svg-icons";

const route = useRoute();
const open = ref(false);

const links = [
  { to: "/", label: "Dashboard", icon: faClipboardList },
  { to: "/applications", label: "Candidatures", icon: faList },
  { to: "/statistics", label: "Statistiques", icon: faChartLine },
];

const isActive = (to: string) => {
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(`${to}/`);
};

// Referme le menu mobile après une navigation.
watch(
  () => route.path,
  () => {
    open.value = false;
  },
);
</script>
