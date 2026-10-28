<template>
  <div class="container mx-auto max-w-5xl px-4 py-8">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1>📋 Dashboard</h1>
      <button type="button" @click="handleNew"
        class="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
        <font-awesome-icon :icon="faPlus" />
        Nouvelle candidature
      </button>
    </div>

    <div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div v-for="stat in stats" class="rounded-xl transition-all">
        <StatCard :label="stat.label" :value="stat.value" :icon="stat.icon" :color="stat.color" />
      </div>
    </div>
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-700">
          Dernières mises à jours
        </h3>
      </div>
      <div v-if="applications.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ApplicationCard v-for="item in latestApplications" :key="item._id" :application="item"
          @edit="handleEdit(item._id as string)"
          class="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" />
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        Aucune candidature pour le moment
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { APPLICATION_GROUPS } from "../data/applicationGroups.ts";
import { APPLICATION_STATUSES } from "../data/applicationStatuses.ts";
import type { Application, ApplicationGroup } from "../interfaces/Application.ts";
import { useApplicationStore } from "../store/application.ts";
import { getApplicationStatus } from "../utils/getApplicationStatus.ts";
import ApplicationCard from "../components/ApplicationCard.vue";
import StatCard from "../components/StatCard.vue";

const appStore = useApplicationStore();
const router = useRouter();

const applications = computed(() =>
  appStore.applications
);

const applicationsByGroup = computed(() => {
  const groups = Object.fromEntries(
    Object.keys(APPLICATION_GROUPS).map((group) => [group, [] as Application[]]),
  ) as Record<ApplicationGroup, Application[]>;
  applications.value.map((app: Application) => {
    groups["total"].push(app);
    groups[APPLICATION_STATUSES[getApplicationStatus(app)].group].push(app);
  });
  return groups;
});

const stats = computed(() =>
  Object.keys(APPLICATION_GROUPS).map((key) => ({
    ...APPLICATION_GROUPS[key as ApplicationGroup],
    value: applicationsByGroup.value[key as ApplicationGroup].length,
  })),
);

const latestApplications = computed(() =>
  applications.value
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6)
);

const handleNew = async () => {
  appStore.resetApp();
  router.push("/createApplication");
};

const handleEdit = async (id: string) => {
  appStore.selectApp(id);
  router.push("/createApplication");
};
</script>
