<template>
  <div class="container mx-auto max-w-6xl px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">📊 Statistiques</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      <!-- Diagramme de distribution (source / statut) -->
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-4">
          Distribution des sources et statuts
        </h2>
        <SankeyDiagram :applications="applications" />
      </div>

      <!-- Graphique d'évolution temporelle -->
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-4">Évolution des candidatures</h2>
        <LineChart :applications="applications" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApplicationStore } from "../store/application";
import SankeyDiagram from "../components/SankeyDiagram.vue";
import LineChart from "../components/LineChart.vue";
import StatCard from "../components/StatCard.vue";

import { computed } from "vue";
import type { Application } from "../interfaces/Application.ts";

const appStore = useApplicationStore();
const applications = computed(() => appStore.applications);

// ✅ Statistiques
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
</script>
