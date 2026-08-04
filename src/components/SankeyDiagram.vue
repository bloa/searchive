<!-- components/SankeyDiagram.vue -->
<template>
  <div class="h-48">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Enregistrer uniquement les composants nécessaires
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

const props = defineProps<{
  applications: any[];
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartRef.value) return;

  // Compter les flux
  const data = props.applications || [];

  // ✅ Sources
  const sources = data.reduce((acc: any, app: any) => {
    const source = app.offerSource || "Non spécifié";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  // ✅ Statuts
  const statuses = data.reduce((acc: any, app: any) => {
    const status = app.status || "Non spécifié";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // ✅ Détruire l'instance précédente
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // ✅ Créer le graphique
  const ctx = chartRef.value.getContext("2d");
  if (!ctx) return;

  // ✅ Couleurs pour les sources
  const sourceColors = [
    "rgba(59, 130, 246, 0.7)",
    "rgba(139, 92, 246, 0.7)",
    "rgba(236, 72, 153, 0.7)",
    "rgba(34, 197, 94, 0.7)",
    "rgba(251, 191, 36, 0.7)",
    "rgba(239, 68, 68, 0.7)",
    "rgba(107, 114, 128, 0.7)",
  ];

  // ✅ Couleurs pour les statuts
  const statusColors = [
    "rgba(59, 130, 246, 0.7)",
    "rgba(139, 92, 246, 0.7)",
    "rgba(34, 197, 94, 0.7)",
    "rgba(239, 68, 68, 0.7)",
    "rgba(251, 191, 36, 0.7)",
    "rgba(107, 114, 128, 0.7)",
  ];

  // ✅ Construire les datasets
  const sourceKeys = Object.keys(sources);
  const statusKeys = Object.keys(statuses);

  const datasets = [
    // Sources (colonne de gauche)
    ...sourceKeys.map((key, index) => ({
      label: key,
      data: [sources[key], 0],
      backgroundColor: sourceColors[index % sourceColors.length],
      borderColor: sourceColors[index % sourceColors.length]!.replace(
        "0.7",
        "1",
      ),
      borderWidth: 1,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
    })),
    // Statuts (colonne de droite)
    ...statusKeys.map((key, index) => ({
      label: key,
      data: [0, statuses[key]],
      backgroundColor: statusColors[index % statusColors.length],
      borderColor: statusColors[index % statusColors.length]!.replace(
        "0.7",
        "1",
      ),
      borderWidth: 1,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
    })),
  ];

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Sources", "Statuts"],
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            font: {
              size: 10,
            },
            boxWidth: 12,
            padding: 8,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw as number;
              if (value === 0) return "";
              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            stepSize: 1,
            font: {
              size: 10,
            },
          },
        },
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
      },
    },
  });
};

// ✅ Mettre à jour le graphique quand les données changent
watch(
  () => props.applications,
  () => {
    createChart();
  },
  { deep: true },
);

// ✅ Créer le graphique au montage
onMounted(() => {
  createChart();
});
</script>
