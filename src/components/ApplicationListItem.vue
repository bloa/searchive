<template>
  <div
    class="group flex flex-col gap-3 border-b border-gray-100 bg-white px-4 py-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
    @click="$emit('click', application._id as string)">
    <div class="h-1 w-full shrink-0 rounded-full sm:h-10 sm:w-1" :style="{ backgroundColor: status.color }"></div>

    <div class="min-w-0 flex-1">
      <div class="flex min-w-0 items-center gap-2">
        <h3 class="min-w-0 truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600"
          :title="application.title">
          {{ application.title }}
        </h3>
      </div>

      <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        <span class="flex min-w-0 items-center gap-1.5">
          <font-awesome-icon :icon="faBuilding" class="shrink-0 text-gray-400" />
          <span class="truncate">{{ application.companyName }}</span>
        </span>

        <span class="flex min-w-0 items-center gap-1.5">
          <font-awesome-icon :icon="faLocationDot" class="shrink-0 text-gray-400" />
          <span class="truncate">{{ application.companyCity }}</span>
        </span>
      </div>
    </div>

    <div class="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
      <span class="flex items-center gap-1.5 text-xs text-gray-500">
        <font-awesome-icon :icon="faCalendarDays" class="text-gray-400" />
        {{ formattedDate }}
      </span>

      <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" :style="{
        color: status.color,
        backgroundColor: `color-mix(in srgb, ${status.color} 8%, white)`
      }">
        {{ status.label }}
      </span>

      <button type="button" @click.stop="$emit('edit', application._id as string)"
        class="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
        title="Modifier la candidature" aria-label="Modifier la candidature">
        <font-awesome-icon :icon="faPen" />
      </button>
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