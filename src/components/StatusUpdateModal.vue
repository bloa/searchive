<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div class="bg-white rounded-xl shadow-lg p-6 w-80">
      <h3 class="text-lg font-semibold mb-4">Modifier le statut</h3>
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">Nouveau statut</label>
        <select v-model="newStatus" class="w-full border rounded-lg px-3 py-2">
          <option v-for="s in APPLICATION_STATUSES" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">Date</label>
        <input v-model="date" type="date" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Annuler
        </button>
        <button @click="confirm" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { APPLICATION_STATUSES } from "../data/applicationStatus";

const props = defineProps<{
  visible: boolean;
  currentStatus: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [status: string, date: string];
}>();

const newStatus = ref(props.currentStatus);
const date = ref(new Date().toISOString().slice(0, 10));

function confirm() {
  if (newStatus.value && date.value) {
    emit("confirm", newStatus.value, date.value);
  }
}
</script>
