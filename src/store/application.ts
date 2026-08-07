import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
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
    phone: undefined,
    city: "",
    postalCode: 35000,
  });

  // Sauvegarde
  const save = () => {
    useLocalStorage().setItem(storageKey, applications.value);
  };

  // Actions
  function setApplication(app: Application) {
    Object.assign(application, app);
  }

  function create(app: Application): Application {
    const newApp = { ...app, _id: generateId() };
    applications.value.push(newApp);
    save();
    return newApp;
  }

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

  function resetForm() {
    Object.assign(application, {
      title: "",
      companyID: "",
      status: "pending",
      offerSource: "LinkedIn",
      offerUrl: "",
      date: new Date().toISOString().split("T")[0],
      responseDate: "",
      HRInterviewDate: "",
      technicalInterviewDate: "",
      acceptationDate: "",
      email: "",
      phoneIndex: 33,
      phone: undefined,
      city: "",
      postalCode: 35000,
    });
  }

  function updateStatus(
    id: string,
    newStatus: Application["status"],
    date: string,
  ) {
    const index = applications.value.findIndex((app) => app._id === id);
    if (index === -1) return;

    const app = applications.value[index];

    // Initialiser l'historique de statuts s'il n'existe pas encore
    if (!app.statusHistory) {
      app.statusHistory = [];
      // Premier élément : statut initial avec la date de candidature
      if (app.date) {
        app.statusHistory.push({ status: app.status, date: app.date });
      }
    }

    // Ajouter le nouveau statut à l'historique
    app.statusHistory.push({ status: newStatus, date });

    // Mettre à jour le statut courant
    app.status = newStatus;

    // Renseigner automatiquement le champ de date correspondant
    switch (newStatus) {
      case "call":
        app.responseDate = date;
        break;
      case "HRInterview":
        app.HRInterviewDate = date;
        break;
      case "technicalInterview":
        app.technicalInterviewDate = date;
        break;
      case "accepted":
        app.acceptationDate = date;
        break;
      // refused n'a pas de champ dédié, on conserve uniquement l'historique
    }

    save();
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
    resetForm,
    updateStatus,
  };
});
