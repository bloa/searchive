<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">
          Exporter les candidatures
        </h3>
        <button
          @click="closeModal"
          class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-6">
        Choisissez le format d'exportation pour vos candidatures
      </p>

      <!-- Options -->
      <div class="space-y-3">
        <button
          @click="exportJSON"
          class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-blue-400 group"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            >
              JSON
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-900">Format JSON</p>
              <p class="text-xs text-gray-500">
                Structure complète des données
              </p>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>

        <button
          @click="exportCSV"
          class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-green-400 group"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            >
              CSV
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-900">Format CSV</p>
              <p class="text-xs text-gray-500">Tableau compatible Excel</p>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-4 border-t border-gray-100">
        <button
          @click="closeModal"
          class="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer hover:bg-gray-100"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Application } from "../interfaces/Application";
import { useCompanyStore } from "../store/company";

interface Props {
  isOpen: boolean;
  applications: Application[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "close"): void;
}>();

const companyStore = useCompanyStore();
const companies = companyStore.companies;

const closeModal = () => {
  emit("update:isOpen", false);
  emit("close");
};

// Fonction pour récupérer le nom de l'entreprise depuis l'ID
const getCompanyName = (application: Application): string => {
  const company = companies.find((c) => c._id === application.companyID);
  return company?.name || "Entreprise inconnue";
};

// Fonction pour récupérer l'objet company complet
const getCompanyObject = (application: Application) => {
  return companies.find((c) => c._id === application.companyID) || null;
};

// Export JSON - Structure complète avec company
const exportJSON = () => {
  const exportData = props.applications.map((app) => {
    // Crée une copie de l'application
    const { companyID, ...appWithoutCompanyID } = app;

    // Ajoute l'objet company complet
    return {
      ...appWithoutCompanyID,
      company: getCompanyObject(app),
      // Garde companyID pour référence si besoin
      companyID: app.companyID,
    };
  });

  const json = JSON.stringify(exportData, null, 2);
  downloadFile(json, "candidatures.json", "application/json");
  closeModal();
};

// Export CSV - Version simplifiée avec nom de l'entreprise
const exportCSV = () => {
  const applications = props.applications;

  if (applications.length === 0) {
    alert("Aucune candidature à exporter");
    return;
  }

  // Définir les colonnes CSV
  const headers = [
    "ID",
    "Titre",
    "Entreprise",
    "Statut",
    "Source",
    "URL Offre",
    "Date Candidature",
    "Date Réponse",
    "Date Entretien RH",
    "Date Entretien Technique",
    "Date Acceptation",
    "Ville",
    "Code Postal",
    "Téléphone",
    "Email",
    "Statut Historique",
  ];

  // Créer les lignes CSV
  const rows = applications.map((app) => {
    const companyName = getCompanyName(app);
    const statusHistory = app.statusHistory || [];

    return [
      `"${escapeCSV(app._id || "")}"`,
      `"${escapeCSV(app.title || "")}"`,
      `"${escapeCSV(companyName)}"`,
      `"${escapeCSV(app.status || "")}"`,
      `"${escapeCSV(app.offerSource || "")}"`,
      `"${escapeCSV(app.offerUrl || "")}"`,
      `"${escapeCSV(formatDate(app.date))}"`,
      `"${escapeCSV(formatDate(app.responseDate))}"`,
      `"${escapeCSV(formatDate(app.HRInterviewDate))}"`,
      `"${escapeCSV(formatDate(app.technicalInterviewDate))}"`,
      `"${escapeCSV(formatDate(app.acceptationDate))}"`,
      `"${escapeCSV(app.city || "")}"`,
      `"${escapeCSV(app.postalCode?.toString() || "")}"`,
      `"${escapeCSV(app.phone?.toString() || "")}"`,
      `"${escapeCSV(app.email || "")}"`,
      `"${escapeCSV(formatStatusHistory(statusHistory))}"`,
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  downloadFile(csv, "candidatures.csv", "text/csv;charset=utf-8;");
  closeModal();
};

// Helper: Échapper les caractères spéciaux CSV
const escapeCSV = (value: string): string => {
  if (!value) return "";
  return value.replace(/"/g, '""');
};

// Helper: Formater la date
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Helper: Formater l'historique des statuts
const formatStatusHistory = (history: any[]): string => {
  if (!history || history.length === 0) return "";
  return history
    .map((entry) => `${entry.status} (${formatDate(entry.date)})`)
    .join(" → ");
};

// Helper: Télécharger le fichier
const downloadFile = (content: string, fileName: string, mimeType: string) => {
  // Ajout BOM pour UTF-8 (spécialement pour Excel)
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
</script>

<style scoped>
/* Animations et styles supplémentaires si nécessaire */
</style>
