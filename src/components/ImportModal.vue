<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="closeModal">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Importer les candidatures
        </h3>

        <button @click="closeModal"
          class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700" aria-label="Fermer">
          <font-awesome-icon :icon="faXmark" />
        </button>
      </div>

      <div class="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <font-awesome-icon :icon="faTriangleExclamation" class="mt-0.5 text-amber-600" />
        <div>
          <p class="mt-1 text-xs text-amber-800">
            Cette action remplacera de façon irréversible toutes vos candidatures actuelles.
          </p>
        </div>
      </div>

      <div v-if="selectedFile" class="mt-4 rounded-lg bg-gray-50 p-3">
        <div class="flex items-center gap-3">
          <font-awesome-icon :icon="faFileCode" class="text-xl text-green-600" />

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-gray-900">
              {{ selectedFile.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ applications.length }} candidatures détectées
            </p>
          </div>

          <button @click="resetFile" class="text-gray-400 hover:text-red-500" aria-label="Supprimer le fichier">
            <font-awesome-icon :icon="faXmark" />
          </button>
        </div>
      </div>

      <div v-else class="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
        <font-awesome-icon :icon="faFileCode" class="mb-3 text-3xl text-green-600" />

        <p class="text-sm font-medium text-gray-800">
          Sélectionnez votre fichier Json
        </p>

        <p class="mt-1 text-xs text-gray-500">
          Utilisez un fichier exporté depuis Searchive
        </p>

        <input ref="fileInput" type="file" accept=".json,text/json" class="hidden" @change="handleFile" />

        <button type="button" @click="fileInput?.click()"
          class="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200">
          Parcourir les fichiers
        </button>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-600">
        {{ error }}
      </p>

      <div class="mt-5 flex gap-3">
        <button @click="closeModal"
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
          Annuler
        </button>

        <button @click="confirmImport" :disabled="!selectedFile || !isValid || importing"
          class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
          {{ importing ? "Importation..." : "Remplacer les données" }}
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { faFileCode, faXmark, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { Application } from "../interfaces/Application";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "import", applications: Application[]): void;
  (e: "close"): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const applications = ref<Application[]>([]);
const error = ref("");
const isValid = ref(false);
const importing = ref(false);

const closeModal = () => {
  emit("update:isOpen", false);
  emit("close");
  resetFile();
};

const resetFile = () => {
  selectedFile.value = null;
  applications.value = [];
  error.value = "";
  isValid.value = false;

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleFile = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) return;

  selectedFile.value = file;

  try {
    const content = await file.text();
    const parsed: unknown = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      throw new Error(
        "Le fichier JSON doit contenir un tableau de candidatures."
      );
    }
    if (parsed.length === 0) {
      throw new Error(
        "Le fichier ne contient aucune candidature."
      );
    }

    const validApplications = parsed.every((app) =>
      app &&
      typeof app === "object" &&
      typeof app.title === "string" &&
      app.statusDates &&
      typeof app.statusDates === "object"
    );

    if (!validApplications) {
      throw new Error(
        "Le fichier contient des candidatures invalides ou incompatibles."
      );
    }

    applications.value = parsed as Application[];
    isValid.value = true;
  } catch (err) {
    error.value =
      err instanceof SyntaxError
        ? "Le fichier JSON est invalide."
        : err instanceof Error
          ? err.message
          : "Impossible de lire le fichier.";
  }
};

const confirmImport = async () => {
  if (!isValid.value || importing.value) return;

  importing.value = true;

  try {
    emit("import", applications.value);
    closeModal();
  } finally {
    importing.value = false;
  }
};
</script>