<template>
  <div class="mx-auto w-full max-w-4xl py-6">
    <Notification v-if="notification.show" :message="notification.message" :sub-message="notification.subMessage"
      :type="notification.type" @close="notification.show = false" />

    <form class="space-y-4" @submit.prevent="handleCreate">
      <!-- Header -->
      <header class="flex items-center gap-4">
        <div
          class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <font-awesome-icon :icon="faBriefcase" class="text-xl" />
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight text-gray-900">
            {{ application._id ? "Modifier la candidature" : "Nouvelle candidature" }}
          </h1>
        </div>
        <button type="button" @click="handleRandom"
          class="ml-auto inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
          <font-awesome-icon :icon="faDice" />
            Random
        </button>
      </header>

      <!-- Offer -->
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-2 py-2">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <font-awesome-icon :icon="faFileLines" />
          </div>
          <div class="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <h2 class="!m-0 font-semibold text-gray-900">Le poste</h2>
            <span class="text-gray-500">&mdash; Quel poste visez vous ?</span>
          </div>
        </div>

        <div class="grid gap-5 p-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <div class="mb-1.5 flex items-baseline gap-3">
              <label for="title" class="text-sm font-medium text-gray-700">
                Intitulé du poste
              </label>
              <span v-if="errors.title" class="text-sm text-red-600">
                <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                {{ errors.title }}
              </span>
            </div>
            <div class="relative">
              <font-awesome-icon :icon="faBriefcase" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="title" v-model="application.title" type="text" required
                placeholder="Ex. : Ingénieur Full Stack"
                class="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                :class="errors.title ? 'border-red-400' : 'border-gray-200'" @blur="validateField('title')"
                @input="errors.title = ''" />
            </div>
          </div>

          <div>
            <div class="mb-1.5 flex items-baseline gap-3">
              <label for="source" class="text-sm font-medium text-gray-700">
                Source de l'offre
              </label>
              <span v-if="errors.source" class="text-sm text-red-600">
                <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                {{ errors.source }}
              </span>
            </div>
            <div class="relative">
              <font-awesome-icon :icon="faGlobe" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select id="source" v-model="application.offerSource"
                class="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                :class="errors.source ? 'border-red-400' : 'border-gray-200'">
                <option value="">Sélectionner une source</option>
                <option v-for="source in OFFER_SOURCES" :key="source.value" :value="source.value">
                  {{ source.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <div class="mb-1.5 flex items-baseline gap-3">
              <label for="method" class="text-sm font-medium text-gray-700">
                Mode de candidature
              </label>
              <span v-if="errors.method" class="text-sm text-red-600">
                <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                {{ errors.method }}
              </span>
            </div>
            <div class="relative">
              <font-awesome-icon :icon="faPaperPlane"
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select id="method" v-model="application.applicationMethod"
                class="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                :class="errors.method ? 'border-red-400' : 'border-gray-200'">
                <option value="">Sélectionner un mode</option>
                <option v-for="method in APPLICATION_METHODS" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Company -->
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-2 py-2">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <font-awesome-icon :icon="faBuilding" />
          </div>
          <div class="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <h2 class="!m-0 font-semibold text-gray-900">L'entreprise</h2>
            <span class="text-gray-500">&mdash; Où souhaitez-vous travailler ?</span>
          </div>
        </div>

        <div class="grid gap-5 p-4 sm:grid-cols-2">
          <div>
            <div class="mb-1.5 flex items-baseline gap-3">
              <label for="company" class="text-sm font-medium text-gray-700">
                Nom de l'entreprise
              </label>
              <span v-if="errors.company" class="text-sm text-red-600">
                <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                {{ errors.company }}
              </span>
            </div>
            <div class="relative">
              <font-awesome-icon :icon="faBuilding" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="company" v-model="application.companyName" type="text" required placeholder="Ex. : Capgemini"
                class="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                :class="errors.company ? 'border-red-400' : 'border-gray-200'" @blur="validateField('company')"
                @input="errors.company = ''" />
            </div>
          </div>

          <div>
            <div class="mb-1.5 flex items-baseline gap-3">
              <label for="city" class="text-sm font-medium text-gray-700">
                Ville
              </label>
              <span v-if="errors.city" class="text-sm text-red-600">
                <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                {{ errors.city }}
              </span>
            </div>
            <div class="relative">
              <font-awesome-icon :icon="faLocationDot"
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="city" v-model="application.companyCity" type="text" required placeholder="Ex. : Rennes"
                class="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                :class="errors.city ? 'border-red-400' : 'border-gray-200'" @blur="validateField('city')" />
            </div>
          </div>

          <div>
            <div class="mb-1.5 flex items-baseline gap-3">
              <label for="size" class="text-sm font-medium text-gray-700">
                Taille de l'entreprise
              </label>
              <span v-if="errors.size" class="text-sm text-red-600">
                <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                {{ errors.size }}
              </span>
            </div>
            <div class="relative">
              <font-awesome-icon :icon="faPeopleGroup"
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select id="size" v-model="application.companySize"
                class="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                :class="errors.size ? 'border-red-400' : 'border-gray-200'">
                <option value="">Sélectionner une taille</option>
                <option v-for="size in COMPANY_SIZES" :key="size.value" :value="size.value">
                  {{ size.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <div class="mb-1.5 flex items-baseline gap-3">
              <label for="sector" class="text-sm font-medium text-gray-700">
                Secteur d'activité
              </label>
              <span v-if="errors.sector" class="text-sm text-red-600">
                <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                {{ errors.sector }}
              </span>
            </div>
            <div class="relative">
              <font-awesome-icon :icon="faIndustry" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select id="sector" v-model="application.companySector"
                class="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                :class="errors.sector ? 'border-red-400' : 'border-gray-200'">
                <option value="">Sélectionner un secteur</option>
                <option v-for="sector in COMPANY_SECTORS" :key="sector.value" :value="sector.value">
                  {{ sector.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Tracking -->
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-2 py-2">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <font-awesome-icon :icon="faTimeline" />
          </div>
          <div class="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <h2 class="!m-0 font-semibold text-gray-900">Le suivi</h2>
            <span class="text-gray-500">&mdash; Où en est votre candidature ?</span>
          </div>
        </div>

        <div class="p-4">
          <div class="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            <div v-for="(status, key) in APPLICATION_STATUSES" :key="key" class="flex items-center gap-3">
              <div class="flex w-12 h-8 items-center justify-center rounded-full" :style="{
                backgroundColor: `color-mix(in srgb, ${status.color} 10%, white)`,
                color: status.color,
              }">
                <font-awesome-icon :icon="status.icon" class="text-xs" />
              </div>
              <label :for="`date-${key}`" class="m-0 w-34 text-sm font-medium text-gray-800">
                {{ status.label }}
                <span v-if="key === 'sent' && errors.date" class="text-sm text-red-600">
                  <font-awesome-icon :icon="faCircleExclamation" class="mr-1" />
                </span>
              </label>
              <input :id="`date-${key}`" v-model="application.statusDates[key]" type="date" :required="key === 'sent'"
                class="w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                :class="key === 'sent' && errors.date ? 'border-red-400' : 'border-gray-200'" />
            </div>
          </div>
        </div>
      </section>

      <!--Notes -->
      <section class=" overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-2 py-2">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <font-awesome-icon :icon="faNoteSticky" />
          </div>
          <div class="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <h2 class="!m-0 font-semibold text-gray-900">Notes</h2>
            <span class="text-gray-500">&mdash; Pour toute information utile</span>
          </div>
        </div>

        <div class="p-4">
          <label for="additionalInfo" class="hidden mb-1.5 block text-sm font-medium text-gray-700">
            Informations complémentaires
          </label>
          <textarea id="additionalInfo" v-model="application.additionalInfo" rows="4"
            placeholder="Lien de l'offre, nom du recruteur, coordonnées, notes après un entretien..."
            class="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </div>
      </section>

      <!-- Actions -->
      <div
        class="sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button type="submit" :disabled="!isFormValid || isLoading"
          class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50">
          <font-awesome-icon :icon="isLoading ? faSpinner : application._id ? faFloppyDisk : faPlus"
            :spin="isLoading" />
          {{ isLoading ? "..." : application._id ? "Enregistrer les modifications" : "Créer la candidature" }}
        </button>

        <button type="button" :disabled="!application._id || isLoading"
          @click="application._id && handleDelete(application._id)"
          class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40">
          <font-awesome-icon :icon="faTrashCan" />
          <span class="hidden sm:inline">Supprimer</span>
        </button>

        <button type="button" :disabled="isLoading" @click="handleCancel"
          class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50">
          <font-awesome-icon :icon="faXmark" />
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>


<script lang="ts" setup>
import { computed, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBriefcase,
  faBuilding,
  faCircleExclamation,
  faDice,
  faFileLines,
  faFloppyDisk,
  faGlobe,
  faIndustry,
  faLocationDot,
  faNoteSticky,
  faPaperPlane,
  faPeopleGroup,
  faPlus,
  faSpinner,
  faTimeline,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { APPLICATION_METHODS } from "../data/applicationMethods.ts";
import { APPLICATION_STATUSES } from "../data/applicationStatuses.ts";
import { COMPANY_SIZES } from "../data/companySizes.ts";
import { COMPANY_SECTORS } from "../data/companySectors.ts";
import { OFFER_SOURCES } from "../data/offerSource";
import type { Application, ApplicationStatus } from "../interfaces/Application.ts";
import { useApplicationStore } from "../store/application";
import Notification from "../components/Notification.vue";

const router = useRouter();
const appStore = useApplicationStore();

const isLoading = ref(false);

const errors = reactive({
  title: "",
  company: "",
  city: "",
  size: "",
  sector: "",
  source: "",
  method: "",
  date: "",
});
const notification = reactive({
  show: false,
  message: "",
  subMessage: "",
  type: "success" as "success" | "error",
});

const application: Application = appStore.$state.application;

const validateField = (field: keyof typeof errors) => {
  switch (field) {
    case "title":
      if (!application.title) {
        errors.title = "Champ requis";
      } else {
        errors.title = "";
      }
      break;

    case "company":
      if (!application.companyName) {
        errors.company = "Champ requis";
      } else {
        errors.company = "";
      }
      break;

    case "city":
      if (!application.companyCity) {
        errors.city = "Champ requis";
      } else {
        errors.city = "";
      }
      break;

    case "size":
      if (!application.companySize) {
        errors.size = "Champ requis";
      } else {
        errors.size = "";
      }
      break;

    case "sector":
      if (!application.companySector) {
        errors.sector = "Champ requis";
      } else {
        errors.sector = "";
      }
      break;

    case "source":
      if (!application.offerSource) {
        errors.source = "Champ requis";
      } else {
        errors.source = "";
      }
      break;

    case "method":
      if (!application.applicationMethod) {
        errors.method = "Champ requis";
      } else {
        errors.method = "";
      }
      break;

    case "date":
      if (!application.statusDates.sent) {
        errors.date = "Champ requis";
      } else {
        errors.date = "";
      }
      break;
  }
};

const isFormValid = computed(() => {
  // Valider tous les champs
  validateField("title");
  validateField("company");
  validateField("city");
  validateField("size");
  validateField("sector");
  validateField("source");
  validateField("method");
  validateField("date");

  return (
    !errors.title &&
    !errors.company &&
    !errors.city &&
    !errors.size &&
    !errors.sector &&
    !errors.source &&
    !errors.method &&
    !errors.date
  );
});

function handleRandom() {
  const randomItem = <T>(items: readonly T[]): T =>
    items[Math.floor(Math.random() * items.length)];

  const titles = [
    "Ingénieur Infrastructure IT / DevOps",
    "Ingénieur Cloud et Réseaux",
    "Stage recherche",
  ];
  const companies = [
    "Google",
    "Apple",
    "Meta",
    "Amazon",
    "Microsoft",
  ];
  const cities = [
    "Tokyo",
    "Kyoto",
  ];
  const tracking: ApplicationStatus[][] = [
    ["sent"],
    ["sent", "refused"],
    ["sent", "abandoned"],
    ["sent", "screening"],
    ["sent", "screening", "refused"],
    ["sent", "screening", "abandoned"],
    ["sent", "screening", "interview"],
    ["sent", "screening", "interview", "accepted"],
    ["sent", "screening", "interview", "refused"],
    ["sent", "screening", "interview", "assignment"],
    ["sent", "screening", "interview", "assignment", "abandoned"],
    ["sent", "screening", "interview", "assignment", "technical", "accepted"],
    ["sent", "screening", "interview", "assignment", "technical", "refused"],
    ["sent", "screening", "assignment"],
    ["sent", "screening", "assignment", "abandoned"],
    ["sent", "screening", "assignment", "technical"],
    ["sent", "screening", "assignment", "technical", "accepted"],
    ["sent", "screening", "assignment", "technical", "refused"],
  ];

  application.title = "TEST " + randomItem(titles);
  application.offerSource = randomItem(OFFER_SOURCES).value;
  application.applicationMethod = randomItem(APPLICATION_METHODS).value;
  application.companyName = randomItem(companies);
  application.companyCity = randomItem(cities);
  application.companySize = randomItem(COMPANY_SIZES).value;
  application.companySector = randomItem(COMPANY_SECTORS).value;

  for (const status of Object.keys(APPLICATION_STATUSES) as ApplicationStatus[]) {
    application.statusDates[status] = "";
  }
  const dates = randomItem(tracking);
  dates.reverse();
  var daysAgo = 0;
  for (const status of dates) {
    daysAgo += Math.floor(Math.random() * 14);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    application.statusDates[status as ApplicationStatus] = date.toISOString().split("T")[0];
    if (status === "abandoned") {
      daysAgo += 21
    }
  }
}

async function handleCreate() {
  if (!isFormValid.value) {
    return;
  }

  isLoading.value = true;
  try {
    appStore.saveApp();
    router.back();
  } catch (error) {
    console.error("Erreur lors de la création:", error);
  } finally {
    isLoading.value = false;
  }
};

async function handleDelete(id: string) {
  if (!confirm("Voulez-vous vraiment supprimer cette candidature ?")) return;

  isLoading.value = true;
  try {
    appStore.deleteApp(id);
    appStore.resetApp();
    router.back();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  } finally {
    isLoading.value = false;
  }
}

function handleCancel() {
  router.back();
}

watch(
  () => application.title,
  () => {
    if (errors.title) errors.title = "";
  },
);
watch(
  () => application.companyName,
  () => {
    if (errors.company) errors.company = "";
  },
);
watch(
  () => application.companyCity,
  () => {
    if (errors.city) errors.city = "";
  },
);
watch(
  () => application.companySize,
  () => {
    if (errors.size) errors.size = "";
  },
);
watch(
  () => application.companySector,
  () => {
    if (errors.sector) errors.sector = "";
  },
);
watch(
  () => application.offerSource,
  () => {
    if (errors.source) errors.source = "";
  },
);
watch(
  () => application.applicationMethod,
  () => {
    if (errors.method) errors.method = "";
  },
);
watch(
  () => application.statusDates.sent,
  () => {
    if (errors.date) errors.date = "";
  },
);
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
