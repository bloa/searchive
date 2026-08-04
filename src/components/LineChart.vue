<template>
  <div class="w-full h-full">
    <div class="flex justify-end gap-2 mb-2">
      <button
        @click="setMode('cumulative')"
        class="px-2 py-0.5 text-xs rounded transition-all duration-200"
        :class="
          mode === 'cumulative'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        "
      >
        Cumulé
      </button>
      <button
        @click="setMode('monthly')"
        class="px-2 py-0.5 text-xs rounded transition-all duration-200"
        :class="
          mode === 'monthly'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        "
      >
        Par mois
      </button>
    </div>

    <div
      v-if="!hasData"
      class="flex items-center justify-center h-full text-gray-400"
    >
      <div class="text-center">
        <svg
          class="w-12 h-12 mx-auto mb-2 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p>Aucune donnée à afficher</p>
        <p class="text-xs text-gray-400">
          Ajoutez des candidatures pour voir les statistiques
        </p>
      </div>
    </div>
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue";

const props = defineProps<{
  applications: any[];
}>();

const mode = ref<"cumulative" | "monthly">("cumulative");

const setMode = (newMode: "cumulative" | "monthly") => {
  if (mode.value !== newMode) {
    mode.value = newMode;
    nextTick(() => {
      createChart();
    });
  }
};

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: any = null;

const hasData = computed(() => {
  return props.applications && props.applications.length > 0;
});

const chartData = computed(() => {
  const data = props.applications || [];

  const months: Record<string, any> = {};
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = {
      month: key,
      label: `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`,
      total: 0,
      accepted: 0,
    };
  }

  data.forEach((app: any) => {
    if (!app.date) return;
    const date = new Date(app.date);
    if (isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (months[key]) {
      months[key].total++;

      if (app.status === "accepted") {
        months[key].accepted++;
      }
    }
  });

  const result = Object.values(months);

  if (mode.value === "cumulative") {
    let cumulativeTotal = 0;
    let cumulativeAccepted = 0;
    return result.map((item: any) => {
      cumulativeTotal += item.total;
      cumulativeAccepted += item.accepted;
      return {
        ...item,
        totalCumulative: cumulativeTotal,
        acceptedCumulative: cumulativeAccepted,
      };
    });
  } else {
    return result.map((item: any) => ({
      ...item,
      totalCumulative: item.total,
      acceptedCumulative: item.accepted,
    }));
  }
});

const createChart = async () => {
  if (!chartRef.value || !hasData.value) return;

  const {
    Chart,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
  } = await import("chart.js");

  Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
  );

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const ctx = chartRef.value.getContext("2d");
  if (!ctx) return;

  const data = chartData.value;
  if (!data || data.length === 0) return;

  const labels = data.map((d) => d.label);

  const maxTotal = Math.max(...data.map((d) => d.totalCumulative), 1);
  const maxAccepted = Math.max(...data.map((d) => d.acceptedCumulative), 1);
  const maxValue = Math.max(maxTotal, maxAccepted);
  const yMax = Math.ceil((maxValue + 1) / 10) * 10;

  const isCumulative = mode.value === "cumulative";
  const yLabel = isCumulative ? "Nombre cumulé" : "Nombre par mois";

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Toutes les candidatures",
          data: data.map((d) => d.totalCumulative),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          borderWidth: 3,
        },
        {
          label: "Candidatures acceptées",
          data: data.map((d) => d.acceptedCumulative),
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "rgb(34, 197, 94)",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              size: 12,
              weight: "bold", // ✅ Correction: 'bold' au lieu de '500'
            },
            boxWidth: 16,
            padding: 16,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: yMax > 0 ? yMax : 10,
          ticks: {
            stepSize: Math.max(1, Math.floor(yMax / 10)),
            font: {
              size: 10,
            },
          },
          grid: {
            color: "rgba(0,0,0,0.06)",
          },
          title: {
            display: true,
            text: yLabel,
            font: {
              size: 11,
              weight: "bold", // ✅ Correction: 'bold' au lieu de '500'
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10,
            },
            maxRotation: 45,
            minRotation: 0,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });
};

watch(mode, () => {
  nextTick(() => {
    createChart();
  });
});

watch(
  () => props.applications,
  () => {
    nextTick(() => {
      createChart();
    });
  },
  { deep: true },
);

onMounted(() => {
  nextTick(() => {
    createChart();
  });
});
</script>
