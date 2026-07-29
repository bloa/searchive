<template>
  <!-- URL -->
  <a
    v-if="application.offerUrl"
    :href="application.offerUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="w-max h-max mt-3 inline-flex items-center text-xs text-blue-500 hover:text-blue-700 transition-colors"
  >
    <div
      class="group w-72 h-40 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <!-- Bande de statut -->
      <div class="h-1" :class="statusColor"></div>

      <div class="p-4">
        <!-- Titre + Statut -->
        <div class="flex items-start justify-between gap-3">
          <h3
            class="text-base font-semibold text-gray-900 truncate flex-1"
            :title="application.title"
          >
            {{ application.title }}
          </h3>
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
            :class="statusBadgeClass"
          >
            <span
              class="w-1.5 h-1.5 rounded-full mr-1"
              :class="statusDotColor"
            ></span>
            {{ statusLabel }}
          </span>
        </div>

        <!-- Entreprise -->
        <div class="mt-2 flex items-center text-sm text-gray-600">
          <svg
            class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span class="truncate">{{ companyName }}</span>
        </div>

        <!-- Infos complémentaires -->
        <div
          class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500"
        >
          <!-- Source -->
          <span class="flex items-center">
            <svg
              class="w-3.5 h-3.5 mr-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {{ sourceLabel }}
          </span>

          <!-- Date -->
          <span class="flex items-center">
            <svg
              class="w-3.5 h-3.5 mr-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ formattedDate }}
          </span>

          <!-- Ville (si disponible dans company) -->
          <span v-if="application.city" class="flex items-center">
            <svg
              class="w-3.5 h-3.5 mr-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ application.city }}
          </span>
        </div>

        <!-- Dates d'entretien -->
        <div v-if="hasInterviewDates" class="mt-2 flex flex-wrap gap-3 text-xs">
          <span
            v-if="application.HRInterviewDate"
            class="flex items-center text-purple-600"
          >
            <svg
              class="w-3.5 h-3.5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            RH: {{ formatDate(application.HRInterviewDate) }}
          </span>
          <span
            v-if="application.technicalInterviewDate"
            class="flex items-center text-blue-600"
          >
            <svg
              class="w-3.5 h-3.5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Tech: {{ formatDate(application.technicalInterviewDate) }}
          </span>
        </div>
      </div>
    </div>
  </a>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Application } from "../interfaces/Application";
import type { Company } from "../interfaces/Company";

// ✅ Props
const props = defineProps<{
  application: Application & { company?: Company };
}>();

const application = props.application;

// ✅ Statut
const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    pending: "En attente",
    call: "Call",
    HRInterview: "Entretien RH",
    technicalInterview: "Entretien technique",
    accepted: "Acceptée",
    refused: "Refusée",
    abandoned: "Abandonnée",
  };
  return labels[application.status] || application.status;
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

// ✅ Company
const companyName = computed(() => {
  return application.company?.name || "Entreprise non spécifiée";
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
  if (application.date) {
    return formatDate(application.date);
  }
  return "Date non définie";
});

const hasInterviewDates = computed(() => {
  return !!(application.HRInterviewDate || application.technicalInterviewDate);
});

// ✅ Utilitaires
const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ✅ Pas besoin de onMounted
</script>
