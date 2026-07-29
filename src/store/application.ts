import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import type { Application } from "../interfaces/Application";

export const useApplicationStore = defineStore("applicationStore", () => {
  // State (réactif)
  const count = ref<number>(0);
  const message = ref<string>("Hello Pinia!");
  const application: Ref<Application> = ref({ title: "" } as Application);

  // Getters (computed)
  const doubleCount = computed(() => count.value * 2);
  const formattedMessage = computed(() => `📝 ${message.value}`);

  // Actions (fonctions)
  function increment(amount: number = 1) {
    count.value += amount;
  }
  function setApplication(app: Application) {
    application.value = app;
  }
  function decrement(amount: number = 1) {
    count.value -= amount;
  }
  function create(app: Application): Application {
    return {} as Application;
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
    application,
    // Getters
    doubleCount,
    formattedMessage,
    // Actions
    increment,
    decrement,
    reset,
    updateMessageAsync,
    setApplication,
    create,
  };
});
