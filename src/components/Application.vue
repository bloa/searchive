<template>
  <div
    class="group w-72 h-40 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    @click="$emit('click', application._id as string)">
    <!-- Bande de statut -->
    <div class="h-1" :class="statusColor"></div>
    <div class="p-4">
      <!-- Titre + Statut -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-base font-semibold text-gray-900 truncate flex-1" :title="application.title">
          {{ application.title }}
        </h3>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
          :class="statusBadgeClass">
          <span class="w-1.5 h-1.5 rounded-full mr-1" :class="statusDotColor"></span>
          {{ statusLabel }}
        </span>
      </div>

      <!-- Entreprise -->
      <div class="mt-2 flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="truncate">{{ companyName }}</span>
      </div>

      <!-- Infos complémentaires -->
      <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <!-- Source -->
        <span class="flex items-center">
          <svg class="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {{ sourceLabel }}
        </span>
        <!-- Date -->
        <span class="flex items-center">
          <svg class="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDate }}
        </span>
        <!-- Ville -->
        <span v-if="application.city" class="flex items-center">
          <svg class="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ application.city }}
        </span>
      </div>

      <!-- Dates d'entretien -->
      <div v-if="hasInterviewDates" class="mt-2 flex flex-wrap gap-3 text-xs">
        <span v-if="application.HRInterviewDate" class="flex items-center text-purple-600">
          <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          RH: {{ formatDate(application.HRInterviewDate) }}
        </span>
        <span v-if="application.technicalInterviewDate" class="flex items-center text-blue-600">
          <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Tech: {{ formatDate(application.technicalInterviewDate) }}
        </span>
      </div>

      <!-- Actions en bas de carte : lien vers l'offre + boutons -->
      <div class="mt-2 flex items-center justify-between">
        <!-- Lien vers l'offre (affiché uniquement si l'URL existe) -->
        <a v-if="application.offerUrl" :href="application.offerUrl" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center text-xs text-blue-500 hover:text-blue-700 transition-colors" @click.stop>
          <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Voir l'offre
        </a>
        <div v-else></div>

        <!-- Actions : modifier et supprimer -->
        <div class="flex items-center gap-1">
          <!-- Bouton pour modifier le statut -->
          <button v-if="
            application.status != 'refused' &&
            application.status != 'accepted' &&
            application.status != 'abandoned'
          " @click.stop="$emit('edit', application._id as string)"
            class="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-50"
            title="Modifier le statut">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <!-- Bouton pour supprimer -->
          <button @click.stop="openDeleteModal"
            class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
            title="Supprimer la candidature">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Popup de confirmation de suppression -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeDeleteModal">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-fadeIn">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">
          Confirmer la suppression
        </h3>
      </div>

      <p class="text-sm text-gray-600 mb-6">
        Êtes-vous sûr de vouloir supprimer la candidature
        <span class="font-medium text-gray-900">"{{ application.title }}"</span>
        pour l'entreprise
        <span class="font-medium text-gray-900">{{ companyName }}</span> ?
        <br /><br />
        Cette action est irréversible.
      </p>

      <div class="flex justify-end gap-3">
        <button @click="closeDeleteModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Annuler
        </button>
        <button @click="confirmDelete"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          :disabled="isDeleting">
          <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ isDeleting ? "Suppression..." : "Supprimer" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Application } from "../interfaces/Application";
import { useCompanyStore } from "../store/company";
import { APPLICATION_STATUSES } from "../data/applicationStatus";

// ✅ Propriétés
const props = defineProps<{
  application: Application;
}>();

// ✅ Événements émis
const emit = defineEmits<{
  click: [id: string];
  edit: [id: string];
  delete: [id: string];
}>();

const application = props.application;
const companyStore = useCompanyStore();

// ✅ État pour la popup de suppression
const showDeleteModal = ref(false);
const isDeleting = ref(false);

// ✅ Gestion de la popup
const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  if (!isDeleting.value) {
    showDeleteModal.value = false;
  }
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    // Émettre l'événement de suppression
    emit("delete", application._id as string);
    // La popup sera fermée par le composant parent après la suppression
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  } finally {
    isDeleting.value = false;
  }
};

// ✅ Statut (labels et couleurs)
const statusLabel = computed(() => {
  const found = APPLICATION_STATUSES.find(
    (s) => s.value === application.status,
  );
  return found?.label || application.status;
});

const statusColor = computed(() => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-400",
    call: "bg-blue-400",
    HRInterview: "bg-purple-400",
    technicalInterview: "bg-indigo-400",
    accepted: "bg-green-400",
    refused: "bg-red-400",
    abandoned: "bg-gray-400",
  };
  return colors[application.status] || "bg-gray-400";
});

const statusBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    call: "bg-blue-50 text-blue-700",
    HRInterview: "bg-purple-50 text-purple-700",
    technicalInterview: "bg-indigo-50 text-indigo-700",
    accepted: "bg-green-50 text-green-700",
    refused: "bg-red-50 text-red-700",
    abandoned: "bg-gray-50 text-gray-700",
  };
  return classes[application.status] || "bg-gray-50 text-gray-700";
});

const statusDotColor = computed(() => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500",
    call: "bg-blue-500",
    HRInterview: "bg-purple-500",
    technicalInterview: "bg-indigo-500",
    accepted: "bg-green-500",
    refused: "bg-red-500",
    abandoned: "bg-gray-500",
  };
  return colors[application.status] || "bg-gray-500";
});

// ✅ Nom de l'entreprise (depuis le store des entreprises)
const companyName = computed(() => {
  const comp = companyStore.companies.find(
    (c) => c._id === application.companyID,
  );
  return comp?.name || "Entreprise non spécifiée";
});

// ✅ Source
const sourceLabel = computed(() => {
  const labels: Record<string, string> = {
    Connaissance: "Connaissance",
    EnPhysique: "Physique",
    LinkedIn: "LinkedIn",
    Indeed: "Indeed",
    HelloWork: "HelloWork",
    JobTeaser: "JobTeaser",
    Other: "Autre",
  };
  return labels[application.offerSource] || application.offerSource;
});

// ✅ Dates
const formattedDate = computed(() => {
  return application.date ? formatDate(application.date) : "Date non définie";
});

const hasInterviewDates = computed(() => {
  return !!(application.HRInterviewDate || application.technicalInterviewDate);
});

// ✅ Utilitaire de formatage
const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
