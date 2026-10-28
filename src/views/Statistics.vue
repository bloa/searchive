<template>
  <div class="container mx-auto max-w-5xl px-4 py-8">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1>📈 Statistiques</h1>
    </div>

    <div class="mt-8 bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">Évolution des candidatures</h2>
      <LineChart :applications="applications" />
    </div>

    <div class="mt-8 bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">Diagramme de Gantt</h2>
      <GanttChart :applications="applications" />
    </div>

    <div class="mt-8 bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">Diagramme de Sankey</h2>
      <SankeyChart :applications="applications" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useApplicationStore } from "../store/application";
import LineChart from "../components/LineChart.vue";
import GanttChart from "../components/GanttChart.vue";
import SankeyChart from "../components/SankeyChart.vue";

const appStore = useApplicationStore();
const applications = computed(() => appStore.applications);
</script>
