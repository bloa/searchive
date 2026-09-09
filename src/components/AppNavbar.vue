<!-- components/AppNavbar.vue -->
<template>
  <header
    class="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4">
        <!-- Marque -->
        <router-link
          to="/"
          class="flex shrink-0 items-center gap-2 text-lg font-bold text-gray-900"
        >
          <span
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm"
          >
            S
          </span>
          <span class="hidden sm:inline">Searchive</span>
        </router-link>

        <!-- Liens (desktop) -->
        <div class="hidden items-center gap-1 md:flex">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="
              isActive(link.to)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            "
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </router-link>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <router-link
            to="/createApplication"
            class="hidden items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md sm:inline-flex"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouvelle candidature
          </router-link>

          <button
            type="button"
            @click="showExportModal = true"
            class="hidden cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-md sm:inline-flex"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Exporter
          </button>

          <!-- Bouton menu (mobile) -->
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            :aria-expanded="open"
            aria-label="Ouvrir le menu"
            @click="open = !open"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!open"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu (mobile) -->
      <div v-if="open" class="space-y-1 pb-4 md:hidden">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="
            isActive(link.to)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          "
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </router-link>
      </div>
    </nav>

    <!-- Modale d'export -->
    <ExportModal
      v-model:is-open="showExportModal"
      :applications="applicationStore.applications"
      @close="showExportModal = false"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import ExportModal from "./ExportModal.vue";
import { useApplicationStore } from "../store/application";

const route = useRoute();
const open = ref(false);
const showExportModal = ref(false);
const applicationStore = useApplicationStore();

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/applications", label: "Candidatures" },
  { to: "/statistics", label: "Statistiques" },
];

// Marque le lien courant : correspondance exacte pour l'accueil,
// correspondance par préfixe pour les autres sections.
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
