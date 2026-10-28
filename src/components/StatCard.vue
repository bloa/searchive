<template>
  <div class="rounded-xl p-4 border shadow-md transition-shadow" :style="{
    backgroundColor: `color-mix(in srgb, ${color} 5%, white)`,
    borderColor: `color-mix(in srgb, ${color} 50%, white)`,
  }">
    <p class="text-base font-semibold text-gray-700 truncate">
      {{ label }}
    </p>

    <div class="flex items-center gap-3 mt-3">
      <font-awesome-icon :icon="icon" :style="{ color }" class="text-2xl" />
      <p class="text-2xl font-bold text-gray-900 tabular-nums">
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

defineProps<{
  label: string;
  value: number | string;
  icon: IconDefinition;
  color?: string;
}>();
</script>
