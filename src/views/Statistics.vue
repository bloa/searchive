<template>
  <div class="container mx-auto max-w-6xl px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">📊 Statistiques</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
import { computed } from "vue";

const appStore = useApplicationStore();
const applications = computed(() => appStore.applications);
</script>
