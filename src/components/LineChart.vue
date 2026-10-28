<template>
  <div v-if="props.applications.length == 0" class="flex items-center justify-center text-sm text-gray-400">
    Aucune donnée à afficher.
  </div>
  <div v-else class="flex w-full h-80 flex-col">
    <div class="mb-3 flex items-center gap-3">
      <span class="text-sm text-gray-500">12 dernières semaines</span>

      <div class="ml-auto flex flex-wrap gap-2">
        <div class="flex gap-1 rounded-lg bg-gray-100 p-1">
          <button v-for="option in [
            { value: 'statuses', label: 'Statuts' },
            { value: 'groups', label: 'Groupes' },
          ]" :key="option.value" @click="displayMode = option.value as typeof displayMode"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition" :class="displayMode === option.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'">
            {{ option.label }}
          </button>
        </div>

        <div class="flex gap-1 rounded-lg bg-gray-100 p-1">
          <button v-for="option in [
            { value: 'cumulative', label: 'Cumulé' },
            { value: 'raw', label: 'Par semaine' },
          ]" :key="option.value" @click="mode = option.value as typeof mode"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition" :class="mode === option.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'">
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="min-h-0 flex-1">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Chart as ChartJS } from "chart.js";
import { APPLICATION_GROUPS } from "../data/applicationGroups";
import { APPLICATION_STATUSES } from "../data/applicationStatuses";
import type { Application, ApplicationGroup, ApplicationStatus } from "../interfaces/Application";

const props = defineProps<{
  applications: Application[];
}>();

const mode = ref<"raw" | "cumulative">("cumulative");
const displayMode = ref<"statuses" | "groups">("statuses");
const chartRef = ref<HTMLCanvasElement | null>(null);

const chartCategories = computed(() =>
  displayMode.value === "statuses"
    ? APPLICATION_STATUSES
    : Object.fromEntries(
      Object.entries(APPLICATION_GROUPS).filter(
        ([key]) => key !== "total",
      ),
    ),
);

let chartInstance: ChartJS | null = null;

const parseDate = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );

  return date.getFullYear() === Number(match[1]) &&
    date.getMonth() === Number(match[2]) - 1 &&
    date.getDate() === Number(match[3])
    ? date
    : null;
};

const getWeekStart = (date: Date): Date => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay() || 7;

  result.setDate(result.getDate() - day + 1);
  return result;
};

const weeks = computed(() => {
  const currentWeek = getWeekStart(new Date());

  return Array.from({ length: 12 }, (_, index) => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - (11 - index) * 7);

    return {
      start,
      key: start.getTime(),
      label: `${start.getDate()} ${new Intl.DateTimeFormat("fr-FR", {
        month: "short",
      }).format(start)}`,
      statuses: Object.fromEntries(
        Object.keys(APPLICATION_STATUSES).map((key) => [key, 0]),
      ) as Record<ApplicationStatus, number>,
      groups: Object.fromEntries(
        Object.keys(APPLICATION_GROUPS).map((key) => [key, 0]),
      ) as Record<ApplicationGroup, number>,
      cumulativeGroups: Object.fromEntries(
        Object.keys(APPLICATION_GROUPS).map((key) => [key, 0]),
      ) as Record<ApplicationGroup, number>,
    };
  });
});

const countedApplications = computed(() => {
  const data = structuredClone(weeks.value);
  const firstWeek = data[0].key;
  const buckets = new Map(data.map((week) => [week.key, week]));

  const baseline = {
    statuses: Object.fromEntries(
      Object.keys(APPLICATION_STATUSES).map((key) => [key, 0]),
    ) as Record<ApplicationStatus, number>,
    groups: Object.fromEntries(
      Object.keys(APPLICATION_GROUPS).map((key) => [key, 0]),
    ) as Record<ApplicationGroup, number>,
  };

  for (const week of data) {
    week.cumulativeGroups = Object.fromEntries(
      Object.keys(APPLICATION_GROUPS).map((key) => [key, 0]),
    ) as Record<ApplicationGroup, number>;
  }

  for (const app of props.applications) {
    const events = Object.entries(app.statusDates ?? {})
      .filter(
        ([key, value]) =>
          key in APPLICATION_STATUSES &&
          typeof value === "string" &&
          value !== "",
      )
      .map(([status, value]) => ({
        status: status as ApplicationStatus,
        date: parseDate(value as string),
      }))
      .filter(
        (event): event is { status: ApplicationStatus; date: Date } =>
          event.date !== null,
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const countedGroupsByWeek = new Map<number, Set<ApplicationGroup>>();
    const seenGroups = new Set<ApplicationGroup>();

    for (const event of events) {
      const weekKey = getWeekStart(event.date).getTime();
      const week = buckets.get(weekKey);
      const isBaseline = weekKey < firstWeek;

      const counts = isBaseline ? baseline : week;

      if (!counts) continue;

      // Count every individual status event.
      counts.statuses[event.status]++;

      const group = APPLICATION_STATUSES[event.status].group as ApplicationGroup;

      // Count each group once per application per week (raw mode).
      let weeklyGroups = countedGroupsByWeek.get(weekKey);

      if (!weeklyGroups) {
        weeklyGroups = new Set();
        countedGroupsByWeek.set(weekKey, weeklyGroups);
      }

      if (!weeklyGroups.has(group)) {
        weeklyGroups.add(group);
        counts.groups[group]++;
      }

      // Count each group only once per application across its entire history.
      if (!seenGroups.has(group)) {
        seenGroups.add(group);

        if (isBaseline) {
          baseline.groups[group]++;
        } else if (week) {
          week.cumulativeGroups[group]++;
        }
      }
    }
  }

  return { baseline, weeks: data };
});

const cumulativeData = computed(() => {
  const statuses = { ...countedApplications.value.baseline.statuses };
  const groups = { ...countedApplications.value.baseline.groups };

  return countedApplications.value.weeks.map((week) => {
    for (const status of Object.keys(statuses) as ApplicationStatus[]) {
      statuses[status] += week.statuses[status];
    }

    for (const group of Object.keys(groups) as ApplicationGroup[]) {
      groups[group] += week.cumulativeGroups[group];
    }

    return {
      statuses: { ...statuses },
      groups: { ...groups },
    };
  });
});

const weeklyData = computed(() => {
  return countedApplications.value.weeks.map((week, index) => {
    const cumulative = cumulativeData.value[index];

    const values =
      displayMode.value === "statuses"
        ? week.statuses
        : week.groups;

    const cumulativeValues =
      displayMode.value === "statuses"
        ? cumulative.statuses
        : cumulative.groups;

    return {
      label: week.label,
      categories: Object.fromEntries(
        Object.keys(chartCategories.value).map((key) => [
          key,
          mode.value === "raw"
            ? values[key as keyof typeof values]
            : cumulativeValues[key as keyof typeof cumulativeValues],
        ]),
      ),
    };
  });
});

const createChart = async () => {
  if (!chartRef.value || props.applications.length == 0) {
    chartInstance?.destroy();
    chartInstance = null;
    return;
  }

  const {
    Chart,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } = await import("chart.js");

  Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  );

  if (!chartRef.value) return;

  chartInstance?.destroy();

  const data = weeklyData.value;

  const datasets = Object.entries(chartCategories.value).map(
    ([key, category]) => ({
      label: category.label,
      data: data.map((week) => week.categories[key]),
      borderColor: category.color,
      backgroundColor: category.color,
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.3,
    }),
  );

  chartInstance = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels: data.map((week) => week.label),
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            padding: 14,
            font: { size: 11 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${context.raw}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
          title: {
            display: true,
            text: mode.value === "raw"
              ? "Nombre de candidatures"
              : "Nombre cumulé",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.06)",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: { size: 10 },
          },
        },
      },
    },
  });
};

watch(
  [() => props.applications, mode, displayMode],
  () => createChart(),
  { deep: true },
);

onMounted(createChart);

onBeforeUnmount(() => {
  chartInstance?.destroy();
  chartInstance = null;
});
</script>