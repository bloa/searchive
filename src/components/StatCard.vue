<!-- components/StatCard.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div class="flex items-center justify-between">
      <span class="text-2xl">{{ icon }}</span>
      <span
        v-if="trend"
        class="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
      >
        +{{ trend }}
      </span>
    </div>
    <p class="text-2xl font-bold text-gray-900 mt-2">{{ value }}</p>
    <p class="text-xs text-gray-500">{{ label }}</p>
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
