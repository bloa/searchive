<template>
  <div v-if="props.applications.length == 0" class="flex items-center justify-center text-sm text-gray-400">
    Aucune donnée à afficher.
  </div>
  <div v-else class="relative w-full h-80">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  Chart,
  Tooltip,
  Title,
  LinearScale,
} from "chart.js";
import {
  SankeyController,
  Flow,
} from "chartjs-chart-sankey";

import type {
  Application,
  ApplicationStatus,
} from "../interfaces/Application";

Chart.register(
  SankeyController,
  Flow,
  Tooltip,
  Title,
  LinearScale,
);

const props = defineProps<{
  applications: Application[];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

const links = computed(() => {
  const transitions: Record<string, number> = {};

  for (const app of props.applications) {
    const history = Object.entries(app.statusDates)
      .filter(([, date]) => Boolean(date))
      .sort(([, a], [, b]) => a!.localeCompare(b!))
      .map(([status]) => status as ApplicationStatus);

    for (let i = 0; i < history.length - 1; i++) {
      const key = `${history[i]}->${history[i + 1]}`;
      transitions[key] = (transitions[key] ?? 0) + 1;
    }
  }

  return Object.entries(transitions).map(([key, flow]) => {
    const [from, to] = key.split("->");
    const fromStatus = from as ApplicationStatus;
    const toStatus = to as ApplicationStatus;

    return {
      from: APPLICATION_STATUSES[fromStatus].label,
      to: APPLICATION_STATUSES[toStatus].label,
      flow,
      colorFrom: APPLICATION_STATUSES[fromStatus].color,
      colorTo: APPLICATION_STATUSES[toStatus].color,
    };
  });
});

let chart: Chart | null = null;

onMounted(() => {
  if (!canvasRef.value) return;

  chart = new Chart(canvasRef.value, {
    type: "sankey",
    data: {
      datasets: [
        {
          data: links.value,
          colorMode: "gradient",
          colorFrom: (context) => (context.dataset.data[context.dataIndex] as typeof links.value[number]).colorFrom,
          colorTo: (context) => (context.dataset.data[context.dataIndex] as typeof links.value[number]).colorTo,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const point = context.raw as {
                from: string;
                to: string;
                flow: number;
              };
              return `${point.from}–${point.to}: ${point.flow}`;
            },
          },
        },
      },
    },
  });
});

const stopWatching = computed(() => links.value);

import { watch } from "vue";
import { APPLICATION_STATUSES } from "../data/applicationStatuses";

const stop = watch(stopWatching, (newLinks) => {
  if (!chart) return;

  chart.data.datasets[0].data = newLinks;
  chart.update();
});

onUnmounted(() => {
  stop();
  chart?.destroy();
  chart = null;
});
</script>
