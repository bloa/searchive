<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="closeModal">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Exporter les candidatures
        </h3>

        <button @click="closeModal"
          class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700" aria-label="Fermer">
          <font-awesome-icon :icon="faXmark" />
        </button>
      </div>

      <div class="mb-4 flex items-center justify-between gap-3">
        <p class="text-sm font-medium text-gray-800">
          Masquer les noms des petites entreprises
        </p>

        <button type="button" role="switch" :aria-checked="anonymize" @click="anonymize = !anonymize"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
          :class="anonymize ? 'bg-blue-600' : 'bg-gray-300'">
          <span class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
            :class="anonymize ? 'translate-x-5' : 'translate-x-0'" />
        </button>
      </div>

      <div class="space-y-2">
        <button @click="exportJSON"
          class="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-blue-400 hover:bg-blue-50">
          <div class="flex items-center gap-3">
            <font-awesome-icon :icon="faFileCode" class="text-xl text-blue-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Format JSON</p>
              <p class="text-xs text-gray-500">Données structurées</p>
            </div>
          </div>

          <font-awesome-icon :icon="faDownload" class="text-sm text-blue-600" />
        </button>

        <button @click="exportCSV"
          class="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-green-400 hover:bg-green-50">
          <div class="flex items-center gap-3">
            <font-awesome-icon :icon="faFileCsv" class="text-xl text-green-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Format CSV</p>
              <p class="text-xs text-gray-500">Compatible avec Excel</p>
            </div>
          </div>

          <font-awesome-icon :icon="faDownload" class="text-sm text-green-600" />
        </button>
      </div>

      <button @click="closeModal"
        class="mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
        Annuler
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRaw } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faDownload, faFileCode, faFileCsv, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { Application } from "../interfaces/Application";

const props = defineProps<{
  isOpen: boolean;
  applications: Application[];
  clientID: string;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "close"): void;
}>();

const anonymize = ref(true);

const closeModal = () => {
  emit("update:isOpen", false);
  emit("close");
};

// Anonymisation

const anonymizeApplication = (app: Application): Application => {
  const result = structuredClone(toRaw(app));

  if (result.companySize === "1-10") {
    result.companyName = "REDACTED";
    result.companyCity = "REDACTED";
  } else if (result.companySize === "11-50") {
    result.companyName = "REDACTED";
  }

  return result;
};

const getExportData = () =>
  props.applications.map((app) =>
    anonymize.value ? anonymizeApplication(app) : structuredClone(toRaw(app)),
  );

const getExportFilename = (extension: "json" | "csv") => {
  const date = new Date().toISOString().slice(0, 10);
  return `searchive_${props.clientID}_export-${date}.${extension}`;
};

// JSON export

const exportJSON = () => {
  const json = JSON.stringify(getExportData(), null, 2);
  downloadFile(json, getExportFilename("json"), "application/json");
  closeModal();
};

// CSV export

const exportCSV = () => {
  if (!props.applications.length) {
    alert("Aucune candidature à exporter");
    return;
  }

  const headers = [
    "Titre",
    "Source",
    "Mode",
    "Entreprise",
    "Ville",
    "Taille",
    "Secteur",
    "Date Candidature",
    "Date Réponse",
    "Date Entretien",
    "Date Travail",
    "Date Technique",
    "Date Acceptation",
    "Date Refus",
    "Date Abandon",
  ];

  const rows = getExportData().map((app) =>
    [
      app.title,
      app.offerSource,
      app.applicationMethod,
      app.companyName,
      app.companyCity,
      app.companySize,
      app.companySector,
      formatDate(app.statusDates.sent),
      formatDate(app.statusDates.screening),
      formatDate(app.statusDates.interview),
      formatDate(app.statusDates.assignment),
      formatDate(app.statusDates.technical),
      formatDate(app.statusDates.accepted),
      formatDate(app.statusDates.refused),
      formatDate(app.statusDates.abandoned),
    ]
      .map((value) => `"${escapeCSV(value)}"`)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");
  downloadFile(csv, getExportFilename("csv"), "text/csv;charset=utf-8;");
  closeModal();
};

// Helpers

const escapeCSV = (value: unknown): string =>
  String(value ?? "").replace(/"/g, '""');

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};
</script>