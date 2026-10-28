<template>
  <header class="sticky top-0 z-40 border-b border-gray-200 bg-white">
    <nav class="relative mx-auto flex max-w-7xl flex-wrap items-center px-4 sm:px-6 lg:px-8">
      <router-link to="/" class="flex h-16 items-center gap-2 text-lg font-bold text-gray-900">
        <span class="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          S
        </span>
        Searchive
      </router-link>
      <button type="button" class="ml-auto rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
        :aria-expanded="open" aria-controls="mobile-navigation" :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="open = !open">
        <font-awesome-icon :icon="open ? faXmark : faBars" class="text-xl" />
      </button>
      <ul class="ml-auto flex w-full flex-col items-end gap-2 pb-4 md:flex-row md:w-auto md:items-center md:pb-0"
        :class="{ 'hidden md:flex': !open }">
        <li v-for="link in links" :key="link.to">
          <router-link :to="link.to"
            class="flex w-40 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            :class="isActive(link.to) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'">
            <font-awesome-icon :icon="link.icon" />
            {{ link.label }}
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars, faChartLine, faClipboardList, faList, faXmark } from "@fortawesome/free-solid-svg-icons";

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

watch(
  () => route.path,
  () => {
    open.value = false;
  },
);
</script>
