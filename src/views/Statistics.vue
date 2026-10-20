<template>
  <div class="container mx-auto max-w-5xl px-4 py-8">
    <!-- En-tête -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1>📈 Statistiques</h1>
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

    <!-- Nouveau : Diagramme de Sankey (flux) -->
    <!-- Flux des candidatures (Sankey) -->
    <div class="mt-8 bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">
        🔀 Flux des candidatures (Sankey)
      </h2>
      <SankeyFlowChart :links="sankeyLinks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useApplicationStore } from "../store/application";
import SankeyDiagram from "../components/SankeyDiagram.vue";
import LineChart from "../components/LineChart.vue";
import GanttChart from "../components/GanttChart.vue";
import SankeyFlowChart from "../components/SankeyFlowChart.vue";
import { useSankeyFlowData } from "../utils/useSankeyFlowData";

const appStore = useApplicationStore();
const applications = computed(() => appStore.applications);

// Données pour le diagramme de Sankey (flux)
const { sankeyLinks } = useSankeyFlowData();
</script>
