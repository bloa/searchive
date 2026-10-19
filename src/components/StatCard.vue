<!-- components/StatCard.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
    <p class="text-base font-medium text-gray-500 truncate">
      {{ label }}
    </p>
    <div class="flex items-center gap-3 mt-3">
      <span v-if="icon" class="text-2xl">
        {{ icon }}
      </span>
      <p class="text-2xl font-bold text-gray-900 tabular-nums">
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: number | string;
  icon: string;
  color?: string;
  trend?: string | null;
}>();
</script>
