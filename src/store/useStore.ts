import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStore = defineStore("counter", () => {
  // State (réactif)
  const count = ref<number>(0);
  const message = ref<string>("Hello Pinia!");

  // Getters (computed)
  const doubleCount = computed(() => count.value * 2);
  const formattedMessage = computed(() => `📝 ${message.value}`);

  // Actions (fonctions)
  function increment(amount: number = 1) {
    count.value += amount;
  }

  function decrement(amount: number = 1) {
    count.value -= amount;
  }

  function reset() {
    count.value = 0;
    message.value = "Hello Pinia!";
  }

  async function updateMessageAsync(newMessage: string) {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.value = newMessage;
  }

  // Tout exporter
  return {
    // State
    count,
    message,
    // Getters
    doubleCount,
    formattedMessage,
    // Actions
    increment,
    decrement,
    reset,
    updateMessageAsync,
  };
});
