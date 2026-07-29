import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";
import type { Application } from "../interfaces/Application";
import { generateId } from "../utils/generatingIDs";
import { useLocalStorage } from "./localStorage";

export const useApplicationStore = defineStore("applicationStore", () => {
  const storageKey = "applications";

  // State
  const applications = ref<Application[]>(
    useLocalStorage().getItem(storageKey, []),
  );

  const application = reactive<Application>({
    title: "fdsfs",
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
    city: "fdsfs",
    postalCode: 35000,
  } as Application);

  // Sauvegarde
  const save = () => {
    useLocalStorage().setItem(storageKey, applications.value);
  };

  // Actions
  function setApplication(app: Application) {
    Object.assign(application, app);
  }

  function create(app: Application): Application {
    const id = generateId();
    app._id = id;
    applications.value.push(app);
    save();
    return app;
  }

  // Autres actions
  function deleteApplication(id: string) {
    applications.value = applications.value.filter((app) => app._id !== id);
    save();
  }

  function updateApplication(id: string, updatedApp: Partial<Application>) {
    const index = applications.value.findIndex((app) => app._id === id);
    if (index !== -1) {
      applications.value[index] = {
        ...applications.value[index],
        ...updatedApp,
      };
      save();
    }
  }

  function getApplicationById(id: string): Application | undefined {
    return applications.value.find((app) => app._id === id);
  }

  // Getters
  const totalApplications = computed(() => applications.value.length);
  const pendingApplications = computed(() =>
    applications.value.filter((app) => app.status === "pending"),
  );
  const acceptedApplications = computed(() =>
    applications.value.filter((app) => app.status === "accepted"),
  );

  return {
    // State
    applications,
    application,
    // Getters
    totalApplications,
    pendingApplications,
    acceptedApplications,
    // Actions
    setApplication,
    create,
    deleteApplication,
    updateApplication,
    getApplicationById,
  };
});
