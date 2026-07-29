<template>
  <div class="container mx-auto max-w-5xl px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">📋 Mes candidatures</h1>
      <router-link
        to="/createApplication"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Nouvelle
      </router-link>
    </div>

    <!-- Barre de recherche et filtre -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex-1 relative">
        <svg
          class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par titre ou entreprise..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tous les statuts</option>
        <option
          v-for="s in APPLICATION_STATUSES"
          :key="s.value"
          :value="s.value"
        >
          {{ s.label }}
        </option>
      </select>
    </div>

    <!-- Résultats -->
    <div
      v-if="filteredApplications.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <ApplicationCard
        v-for="app in filteredApplications"
        :key="app._id"
        :application="app"
        @click="goToDetail"
      />
    </div>
    <div v-else class="text-center py-12 text-gray-500">
      <p class="text-xl">Aucune candidature trouvée</p>
      <p class="mt-2">Essayez de modifier votre recherche ou filtre.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useApplicationStore } from "../store/application";
import { useCompanyStore } from "../store/company";
import { APPLICATION_STATUSES } from "../data/applicationStatus";
import ApplicationCard from "../components/Application.vue"; // ← ton fichier actuel

const router = useRouter();
const appStore = useApplicationStore();
const companyStore = useCompanyStore();

const searchQuery = ref("");
const statusFilter = ref("");

// ✅ Filtrage réactif
const filteredApplications = computed(() => {
  let apps = appStore.applications;

  // Filtre par statut
  if (statusFilter.value) {
    apps = apps.filter((a) => a.status === statusFilter.value);
  }

  // Recherche textuelle (titre ou entreprise)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    apps = apps.filter((a) => {
      const titleMatch = a.title.toLowerCase().includes(query);
      const comp = companyStore.companies.find((c) => c._id === a.companyID);
      const companyName = comp?.name?.toLowerCase() || "";
      return titleMatch || companyName.includes(query);
    });
  }

  return apps;
});

// ✅ Action au clic sur une carte (à développer au Sprint 2)
const goToDetail = (id: string) => {
  console.log("Candidature cliquée:", id);
  // router.push(`/application/${id}`);
};
</script>
