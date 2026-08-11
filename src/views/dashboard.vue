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
        <!--buttons-->
        <div class="flex sm:flex-row flex-col items-end gap-2">
          <!--links-->
          <div class="flex gap-2">
            <router-link
              to="/createApplication"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nouvelle candidature
            </router-link>
            <router-link
              to="/statistics"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Statistiques
            </router-link>
          </div>
          <!--export-->
          <div>
            <button
              @click="showExportModal = true"
              class="inline-flex cursor-pointer h-full items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Exporter
            </button>
          </div>
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
            <router-link
              to="/applications"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir toutes →
            </router-link>
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

    <!-- Export Modal -->
    <ExportModal
      v-model:is-open="showExportModal"
      :applications="applicationsData"
      @close="showExportModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import type { Application } from "../interfaces/Application";
import { useApplicationStore } from "../store/application";
import StatCard from "../components/StatCard.vue";
import ApplicationCard from "../components/Application.vue";
import ExportModal from "../components/ExportModal.vue";

// ✅ Store
const applicationStore = useApplicationStore();
const loading = ref(true);
const showExportModal = ref(false);

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
