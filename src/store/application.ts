import { defineStore } from "pinia";
import { ref, reactive, toRaw } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Application } from "../interfaces/Application";
import { useLocalStorage } from "./localStorage";

export const useApplicationStore = defineStore("applicationStore", () => {
  const storageKey = "applications";
  const storage = useLocalStorage();

  // State
  const applications = ref<Application[]>(
    storage.getItem(storageKey, null) ?? [],
  );
  const application = reactive<Application>(defaultApplication());

  // Actions
  function resetApp() {
    Object.assign(application, defaultApplication());
  }

  function selectApp(id: string) {
    resetApp();
    const app = applications.value.find((app) => app._id === id);
    if (app) {
      Object.assign(application, structuredClone(toRaw(app)))
    }
  }

  function saveApp() {
    application.timestamp = new Date().getTime();
    if (!application._id) application._id = uuidv4();
    const index = applications.value.findIndex((app) => app._id === application._id);
    if (index !== -1) {
      applications.value[index] = structuredClone(toRaw(application));
    } else {
      applications.value.push(structuredClone(toRaw(application)));
    }
    storage.setItem(storageKey, applications.value);
  }

  function deleteApp(id: string) {
    applications.value = applications.value.filter((app) => app._id !== id);
    storage.setItem(storageKey, applications.value);
  }

  function defaultApplication(): Application {
    return {
      _id: undefined,
      title: "",
      companyName: "",
      companyCity: "",
      companySize: "",
      companySector: "",
      offerSource: "",
      applicationMethod: "",
      statusDates: {
        sent: "",
        screening: "",
        interview: "",
        assignment: "",
        technical: "",
        accepted: "",
        refused: "",
        abandoned: "",
      },
      additionalInfo: "",
      timestamp: 0,
    };
  }

  return {
    applications,
    application,
    resetApp,
    selectApp,
    saveApp,
    deleteApp,
  };
});
