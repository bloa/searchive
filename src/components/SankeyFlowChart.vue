<template>
  <div class="sankey-flow-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Chart } from "chart.js";
import { SankeyController, Flow } from "chartjs-chart-sankey";

Chart.register(SankeyController, Flow);

const props = defineProps<{
  links: { from: string; to: string; flow: number }[];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!canvasRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Configuration adaptée aux attentes du plugin
  const config: any = {
    type: "sankey",
    data: {
      datasets: [
        {
          label: "Flux des candidatures",
          data: props.links,
          colorMode: "gradient",
          colorFrom: "blue",
          colorTo: "red",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Diagramme de Sankey – Flux entre statuts",
        },
      },
    },
  };

  chartInstance = new Chart(canvasRef.value, config);
};

onMounted(() => {
  createChart();
});

watch(
  () => props.links,
  () => {
    createChart();
  },
  { deep: true },
);
</script>

<style scoped>
.sankey-flow-container {
  width: 100%;
  height: 500px;
  position: relative;
}
</style>
