<template>
  <div
    class="group w-72 overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-blue-200 hover:shadow-md"
    @click="$emit('click', application._id as string)">
    <!-- Status bar -->
    <div class="h-1" :style="{ backgroundColor: status.color }"></div>

    <div class="p-4">
      <div class="flex items-center justify-between gap-2">
        <h3 class="min-w-0 flex-1 truncate text-base font-semibold text-gray-900" :title="application.title">
          {{ application.title }}
        </h3>
        <button type="button" @click.stop="$emit('edit', application._id as string)"
          class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
          title="Modifier la candidature" aria-label="Modifier la candidature">
          <font-awesome-icon :icon="faPen" />
        </button>
      </div>

      <div class="mt-2 flex items-center gap-4 text-sm text-gray-600">
        <span class="flex min-w-0 items-center gap-1.5">
          <font-awesome-icon :icon="faBuilding" class="shrink-0 text-gray-400" />
          <span class="truncate">{{ application.companyName }}</span>
        </span>
        <span class="flex min-w-0 items-center gap-1.5">
          <font-awesome-icon :icon="faLocationDot" class="shrink-0 text-gray-400" />
          <span class="truncate">{{ application.companyCity }}</span>
        </span>
      </div>

      <div class="mt-3 flex items-center justify-between gap-2">
        <span class="flex items-center gap-1.5 text-xs text-gray-500">
          <font-awesome-icon :icon="faCalendarDays" class="text-gray-400" />
          {{ formattedDate }}
        </span>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium" :style="{
          color: status.color,
          backgroundColor: `color-mix(in srgb, ${status.color} 5%, white)`
        }">
          {{ status.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Application } from "../interfaces/Application";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBuilding,
  faCalendarDays,
  faLocationDot,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { APPLICATION_STATUSES } from "../data/applicationStatuses";
import { getApplicationStatus } from "../utils/getApplicationStatus";

const props = defineProps<{
  application: Application;
}>();

defineEmits<{
  click: [id: string];
  edit: [id: string];
  delete: [id: string];
}>();

const status = computed(() => APPLICATION_STATUSES[getApplicationStatus(props.application)]);

// Date of application
const formattedDate = computed(() => {
  const latestDate = Object.values(props.application.statusDates)
    .filter((date): date is string => !!date)
    .sort()
    .at(-1);
  return latestDate ? formatDate(latestDate) : "—";
});

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>