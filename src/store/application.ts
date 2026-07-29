import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import type { Application } from "../interfaces/Application";
import { generateId } from "../utils/generatingIDs";
import { useLocalStorage } from "./localStorage";

export const useApplicationStore = defineStore("applicationStore", () => {
  const storageKey = "applications";
  const save = () => {
    useLocalStorage().setItem(storageKey, applications);
  };
  // State (réactif)
  const count = ref<number>(0);
  const message = ref<string>("Hello Pinia!");
  const applications: Ref<Application[]> = ref(
    useLocalStorage().getItem(storageKey, []),
  );
  const application: Ref<Application> = ref({
    title: "",
    companyID: "",
    status: "pending",
    offerSource: "LinkedIn",
    offerUrl: "",
    date: "",
    responseDate: "",
    HRInterviewDate: "",
    technicalInterviewDate: "",
    acceptationDate: "",
    email: "",
    phoneIndex: 33,
    phone: 767566603,
    city: "",
    postalCode: 35000,
  } as Application);

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
    const id = generateId();
    app._id = id;
    applications.value.push(app);
    save();
    return app;
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
