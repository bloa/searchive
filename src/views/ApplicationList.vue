<template>
  <div class="container mx-auto max-w-5xl px-4 py-8">
    <!-- En-tête -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1>📑 Candidatures</h1>
      <button type="button" @click="handleNew"
        class="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
        <font-awesome-icon :icon="faPlus" />
        Nouvelle candidature
      </button>
      <button @click="handleExport"
        class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
        <font-awesome-icon :icon="faDownload" />
        Exporter
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div class="p-6 pb-4">
        <div class="relative">
          <font-awesome-icon :icon="faMagnifyingGlass" class="absolute inset-y-0 left-3 my-auto size-5 text-gray-400" />
          <input v-model="searchQuery" type="search" placeholder="Rechercher par titre, entreprise, ou ville..."
            class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <!-- Status tabs -->
      <div class="flex overflow-x-auto border-b border-gray-200 px-4">
        <button v-for="stat in stats" :key="stat.status" type="button" @click="selectedStatus = stat.status"
          class="flex shrink-0 items-center gap-2 border-b-2 px-2 py-3 text-sm font-medium transition-colors"
          :class="selectedStatus === stat.status ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'">
          {{ stat.label }}
          <span class="rounded-full px-2 py-0.5 text-xs"
            :class="selectedStatus === stat.status ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'">
            {{ stat.value }}
          </span>
        </button>
      </div>

      <!-- Applications -->
      <div class="p-6">
        <div v-if="displayedApplications.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ApplicationCard v-for="app in displayedApplications" :key="app._id" :application="app"
            @edit="handleEdit(app._id as string)"
            class="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" />
        </div>

        <div v-else class="py-12 text-center text-gray-500">
          Aucun résultat.
        </div>
      </div>
    </div>
  </div>
  <ExportModal v-model:is-open="showExportModal" :applications="applicationsData" :clientID="clientID"
    @close="showExportModal = false" />
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faDownload, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { APPLICATION_GROUPS } from "../data/applicationGroups.ts";
import { APPLICATION_STATUSES } from "../data/applicationStatuses.ts";
import type { Application, ApplicationStatus } from "../interfaces/Application.ts";
import { useApplicationStore } from "../store/application";
import { useClientStore } from "../store/client";
import { getApplicationStatus } from "../utils/getApplicationStatus.ts";
import ApplicationCard from "../components/ApplicationCard.vue";
import ExportModal from "../components/ExportModal.vue";

const appStore = useApplicationStore();
const clientStore = useClientStore();
const router = useRouter();

const applications = computed(() =>
  appStore.applications
);
const clientID = computed(() =>
  clientStore.clientID
);

const applicationsByStatus = computed(() => {
  const groups = Object.fromEntries(
    Object.keys(APPLICATION_STATUSES).map((status) => [status, [] as Application[]]),
  ) as Record<ApplicationStatus, Application[]>;
  applications.value.map((app: Application) => {
    groups[getApplicationStatus(app)].push(app);
  });
  return groups;
});

const searchQuery = ref("");
const selectedStatus = ref<ApplicationStatus | "">("");

const displayedApplications = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return (selectedStatus.value === "" ? applications.value : applicationsByStatus.value[selectedStatus.value]).filter((app) => {
    const matchesSearch =
      !query ||
      app.title.toLowerCase().includes(query) ||
      app.companyName.toLowerCase().includes(query) ||
      app.companyCity.toLowerCase().includes(query);
    return matchesSearch;
  });
});

const stats = computed(() => [
  {
    status: "" as const,
    label: APPLICATION_GROUPS.total.label,
    value: applications.value.length,
  },
  ...Object.entries(APPLICATION_STATUSES).map(([status, config]) => ({
    status: status as ApplicationStatus,
    label: config.label,
    value: applicationsByStatus.value[status as ApplicationStatus].length,
  })),
]);

const handleNew = async () => {
  appStore.resetApp();
  router.push("/createApplication");
};

const handleExport = async () => {
  showExportModal.value = true;
};

const handleEdit = async (id: string) => {
  appStore.selectApp(id);
  router.push("/createApplication");
};

const showExportModal = ref(false);

const applicationsData = computed(() => {
  return appStore.applications || [];
});
</script>
