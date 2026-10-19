<template>
  <div class="container mx-auto max-w-5xl px-4 py-8">
    <!-- En-tête -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1>📋 Dashboard</h1>
      <div class="flex items-end gap-2">
        <router-link to="/createApplication"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle candidature
        </router-link>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-2 text-gray-500">Chargement des données...</p>
    </div>

    <!-- Contenu principal -->
    <template v-else>
      <!-- Statistiques -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard v-for="stat in stats" :label="stat.label" :value="stat.value" :icon="stat.icon" />
      </div>

      <!-- Dernières candidatures -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-700">
            Dernières candidatures
          </h3>
        </div>
        <div v-if="recentApplications.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ApplicationCard v-for="item in recentApplications" :key="item._id" :application="item"
            @edit="openStatusModal(item._id as string)" @delete="applicationStore.deleteApplication(item._id as string)"
            class="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          Aucune candidature pour le moment
        </div>
      </div>
    </template>
  </div>
  <StatusUpdateModal :visible="statusModalVisible" :currentStatus="selectedApplication?.status ?? 'pending'"
    @close="statusModalVisible = false" @confirm="handleStatusUpdate" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Application } from "../interfaces/Application";
import { useApplicationStore } from "../store/application";
import StatCard from "../components/StatCard.vue";
import ApplicationCard from "../components/Application.vue";
import StatusUpdateModal from "../components/StatusUpdateModal.vue";

// Store
const applicationStore = useApplicationStore();

// États d'affichage
const loading = ref(true);

// Gestion de la modale de modification de statut
const statusModalVisible = ref(false);
const selectedApplicationId = ref<string | null>(null);

// Données des applications
const applicationsData = computed(() => {
  return applicationStore.applications || [];
});

// Les 3 candidatures les plus récentes
const recentApplications = computed(() => {
  const data = applicationsData.value;
  if (!data.length) return [];

  return [...data]
    .filter((a: Application) => a.date)
    .sort((a: Application, b: Application) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);
});

// Statistiques
const stats = computed(() => {
  const data = applicationsData.value;
  const statusCount = data.reduce((acc: any, app: Application) => {
    const status = app.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return [
    {
      label: "Total",
      value: data.length,
      icon: "📊",
    },
    {
      label: "En attente",
      value: statusCount.pending || 0,
      icon: "⏳",
    },
    {
      label: "Entretiens",
      value:
        (statusCount.HRInterview || 0) + (statusCount.technicalInterview || 0),
      icon: "🎯",
    },
    {
      label: "Acceptées",
      value: statusCount.accepted || 0,
      icon: "✅",
    },
    {
      label: "Refusées",
      value: statusCount.refused || 0,
      icon: "❌",
    },
  ];
});

// Application sélectionnée pour la modification
const selectedApplication = computed(() => {
  if (!selectedApplicationId.value) return null;
  return applicationStore.getApplicationById(selectedApplicationId.value);
});

// Ouvrir la modale de modification
function openStatusModal(id: string) {
  selectedApplicationId.value = id;
  statusModalVisible.value = true;
}

// Gérer la mise à jour du statut
function handleStatusUpdate(newStatus: string, date: string) {
  if (selectedApplicationId.value) {
    applicationStore.updateStatus(
      selectedApplicationId.value,
      newStatus as Application["status"],
      date,
    );
    statusModalVisible.value = false;
    selectedApplicationId.value = null;
  }
}

// Chargement initial
const loadData = () => {
  loading.value = true;
  try {
    // Le simple accès aux données suffit à déclencher la réactivité
    applicationStore.applications;
  } catch (error) {
    console.error("Erreur de chargement:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
