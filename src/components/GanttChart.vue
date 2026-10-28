<template>
  <div v-if="props.applications.length == 0" class="flex items-center justify-center text-sm text-gray-400">
    Aucune donnée à afficher.
  </div>
  <div v-else class="flex h-80 w-full flex-col">
    <!-- Sorting controls -->
    <div class="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
      <span class="text-sm text-gray-600">Trier par</span>

      <div class="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
        <button v-for="option in [
          { value: 'created-desc', label: 'Création ↓' },
          { value: 'created-asc', label: 'Création ↑' },
          { value: 'finished-desc', label: 'Fin ↓' },
          { value: 'finished-asc', label: 'Fin ↑' },
        ]" :key="option.value" @click="sortBy = option.value as SortOption"
          class="rounded-md px-3 py-1.5 text-xs font-medium transition"
          :class="sortBy === option.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'">
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Fixed timeline header -->
    <div class="flex h-10 shrink-0">
      <div class="sticky left-0 z-10 w-40 shrink-0 bg-white font-semibold">
        Candidature
      </div>

      <div class="relative flex-1 overflow-hidden border-b border-gray-200">
        <div v-for="tick in ticks" :key="tick.left" class="absolute top-0 flex h-full flex-col items-center"
          :style="{ left: `${tick.left}px` }">
          <span class="whitespace-nowrap text-xs text-gray-500">
            {{ tick.label }}
          </span>
          <span class="mt-1 w-px flex-1 bg-gray-200" />
        </div>
      </div>
    </div>

    <!-- Scrollable application rows -->
    <div class="min-h-0 flex-1 overflow-auto">
      <div :style="{ width: `${chartWidth}px`, minWidth: '100%' }">
        <div v-for="row in sortedRows" :key="row.id" class="flex items-center border-b border-gray-100">
          <div class="sticky left-0 z-10 w-40 shrink-0 truncate bg-white py-2 pr-3 text-sm font-medium"
            :title="row.title">
            {{ row.companyName }}, {{ row.companyCity }}
          </div>

          <div class="relative my-1 h-7 flex-1 rounded bg-gray-100">
            <div v-for="segment in row.segments" :key="segment.status"
              class="absolute inset-y-0 flex items-center overflow-hidden rounded px-1 text-xs text-white transition-opacity hover:opacity-85"
              :style="{
                left: `${segment.left}px`,
                width: `${segment.width}px`,
                backgroundColor: segment.color,
              }" :title="`${segment.label} (${segment.start} → ${segment.end})`">
              <span v-if="segment.width > 45" class="truncate">
                {{ segment.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { APPLICATION_STATUSES } from "../data/applicationStatuses";
import type {
  Application,
  ApplicationStatus,
} from "../interfaces/Application";

const props = defineProps<{
  applications: Application[];
}>();

const DAY = 24 * 60 * 60 * 1000;
const LABEL_WIDTH = 160;
const MIN_CHART_WIDTH = 700;
const MIN_DAY_WIDTH = 8;
const DATE_PADDING = 5;

const today = new Date();

const histories = computed(() =>
  props.applications.flatMap((app) => {
    const history = (
      Object.entries(app.statusDates) as [
        ApplicationStatus,
        string | undefined,
      ][]
    )
      .filter(([, date]) => Boolean(date))
      .sort(([, a], [, b]) => a!.localeCompare(b!));

    return history.length
      ? [{ app, history }]
      : [];
  }),
);

const dateRange = computed(() => {
  const dates = histories.value.flatMap(({ history }) =>
    history.map(([, date]) => new Date(date!).getTime()),
  );

  if (!dates.length) {
    return {
      start: today.getTime() - 30 * DAY,
      end: today.getTime(),
    };
  }

  return {
    start: Math.min(...dates) - DATE_PADDING * DAY,
    end: Math.max(today.getTime(), ...dates) + DATE_PADDING * DAY,
  };
});

const totalDays = computed(() =>
  Math.max(1, (dateRange.value.end - dateRange.value.start) / DAY),
);

const dayWidth = computed(() =>
  Math.max(MIN_DAY_WIDTH, MIN_CHART_WIDTH / totalDays.value),
);

const timelineWidth = computed(() =>
  totalDays.value * dayWidth.value,
);

const chartWidth = computed(() =>
  LABEL_WIDTH + 8 + timelineWidth.value,
);

const ticks = computed(() => {
  const result: { label: string; left: number }[] = [];
  const current = new Date(dateRange.value.start);
  const end = dateRange.value.end;

  current.setHours(0, 0, 0, 0);

  while (current.getTime() <= end) {
    const left =
      ((current.getTime() - dateRange.value.start) / DAY) *
      dayWidth.value;

    const label = current.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });

    const previous = result[result.length - 1];

    if (!previous || left - previous.left >= 50) {
      result.push({ label, left });
    }

    current.setDate(current.getDate() + 7);
  }

  return result;
});

const rows = computed(() =>
  histories.value.map(({ app, history }) => {
    const lastStatus = history[history.length - 1][0];
    const isFinished =
      APPLICATION_STATUSES[lastStatus].group === "finished";

    const sentDate =
      history.find(([status]) => status === "sent")?.[1] ??
      history[0][1]!;

    const finishDate = isFinished
      ? history[history.length - 1][1]!
      : today.toISOString().slice(0, 10);

    return {
      id: app._id!,
      title: app.title,
      companyName: app.companyName,
      companyCity: app.companyCity,
      createdAt: sentDate,
      finishedAt: finishDate,
      segments: history.map(([status, date], index) => {
        const start = new Date(date!).getTime();
        const nextDate = history[index + 1]?.[1];

        // Finished applications stop at their final status date.
        // Ongoing applications extend to today.
        const end = nextDate
          ? new Date(nextDate).getTime()
          : isFinished
            ? start
            : today.getTime();

        return {
          status,
          label: APPLICATION_STATUSES[status].label,
          color: APPLICATION_STATUSES[status].color,
          start: date!,
          end: nextDate ?? finishDate,
          left:
            ((start - dateRange.value.start) / DAY) * dayWidth.value,
          width: Math.max(
            2,
            ((end - start) / DAY) * dayWidth.value,
          ),
        };
      }),
    };
  }),
);

type SortOption = "created-asc" | "created-desc" | "finished-asc" | "finished-desc";

const sortBy = ref<SortOption>("created-desc");

const sortedRows = computed(() =>
  [...rows.value].sort((a, b) => {
    switch (sortBy.value) {
      case "created-asc":
        return a.createdAt.localeCompare(b.createdAt);

      case "created-desc":
        return b.createdAt.localeCompare(a.createdAt);

      case "finished-asc":
        return a.finishedAt.localeCompare(b.finishedAt);

      case "finished-desc":
        return b.finishedAt.localeCompare(a.finishedAt);
    }
  }),
);
</script>
