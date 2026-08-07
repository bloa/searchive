<template>
  <div class="container mx-auto max-w-6xl px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">📊 Statistiques</h1>

    <!-- Cartes statistiques -->
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

    <!-- Graphiques de distribution et d'évolution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-4">
          Distribution des sources et statuts
        </h2>
        <SankeyDiagram :applications="applications" />
      </div>
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-4">Évolution des candidatures</h2>
        <LineChart :applications="applications" />
      </div>
    </div>

    <!-- Diagramme de Gantt en pleine largeur -->
    <div class="mt-8 bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">📅 Diagramme de Gantt</h2>
      <GanttChart />
    </div>

    <!-- Flux Sankey (optionnel, décommentez si implémenté) -->
    <!-- <div class="mt-8 bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">Flux des candidatures (Sankey)</h2>
      <SankeyFlow :nodes="sankeyFlowData.nodes" :links="sankeyFlowData.links" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useApplicationStore } from "../store/application";
import SankeyDiagram from "../components/SankeyDiagram.vue";
import LineChart from "../components/LineChart.vue";
import StatCard from "../components/StatCard.vue";
import GanttChart from "../components/GanttChart.vue";
// import SankeyFlow from "../components/SankeyFlow.vue"; // Décommentez si SankeyFlow est prêt
// import { useSankeyFlowData } from "../composables/useSankeyFlowData";
import type { Application } from "../interfaces/Application";

const appStore = useApplicationStore();
const applications = computed(() => appStore.applications);

// Calcul des statistiques pour les cartes
const stats = computed(() => {
  const data = applications.value;
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

// Données pour le Sankey flow (décommentez quand le composable est prêt)
// const { sankeyData: sankeyFlowData } = useSankeyFlowData();
</script>
