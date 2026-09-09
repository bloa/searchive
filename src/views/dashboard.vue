<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/30"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-500">
            Vue d'ensemble de votre recherche de stage
          </p>
        </div>
      </div>

      <!-- ✅ État de chargement -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-2 text-gray-500">Chargement des données...</p>
      </div>

      <!-- ✅ Contenu -->
      <template v-else>
        <!-- Statistiques -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :icon="stat.icon"
            :color="stat.color"
            :trend="stat.trend"
          />
        </div>

        <!-- Dernières candidatures -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-700">
              Dernières candidatures
            </h3>
          </div>
          <div
            v-if="recentApplications.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <ApplicationCard
              v-for="item in recentApplications"
              :key="item._id"
              :application="item"
              class="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            />
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Aucune candidature pour le moment
          </div>
        </div>
      </template>
    </div>

    <!-- Modale de modification du statut -->
    <StatusUpdateModal
      :visible="statusModalVisible"
      :currentStatus="selectedApplication?.status ?? 'pending'"
      @close="statusModalVisible = false"
      @confirm="handleStatusUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import type { Application } from "../interfaces/Application";
import { useApplicationStore } from "../store/application";
import StatCard from "../components/StatCard.vue";
import ApplicationCard from "../components/Application.vue";

// ✅ Store
const applicationStore = useApplicationStore();
const loading = ref(true);

// ✅ Données des applications
const applicationsData = computed(() => {
  return applicationStore.applications || [];
});

// ✅ 3 plus récentes
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

// ✅ Statistiques
const stats = computed(() => {
  const data = applicationsData.value;
  const total = data.length;

  const statusCount = data.reduce((acc: any, app: Application) => {
    const status = app.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const accepted = statusCount.accepted || 0;
  const refused = statusCount.refused || 0;
  const totalWithResponse = accepted + refused;
  const successRate =
    totalWithResponse > 0
      ? Math.round((accepted / totalWithResponse) * 100)
      : 0;

  return [
    { label: "Total", value: total, icon: "📊", color: "blue", trend: null },
    {
      label: "En attente",
      value: statusCount.pending || 0,
      icon: "⏳",
      color: "yellow",
      trend: null,
    },
    {
      label: "Entretiens",
      value:
        (statusCount.HRInterview || 0) + (statusCount.technicalInterview || 0),
      icon: "🎯",
      color: "purple",
      trend: null,
    },
    {
      label: "Acceptées",
      value: accepted,
      icon: "✅",
      color: "green",
      trend: successRate > 0 ? `${successRate}%` : null,
    },
    {
      label: "Refusées",
      value: refused,
      icon: "❌",
      color: "red",
      trend: null,
    },
    {
      label: "Sources",
      value: Object.keys(
        data.reduce((acc: any, app: Application) => {
          const source = app.offerSource || "Autre";
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {}),
      ).length,
      icon: "📌",
      color: "indigo",
      trend: null,
    },
  ];
});

// ✅ Chargement
const loadData = () => {
  loading.value = true;
  try {
    applicationStore.applications;
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
