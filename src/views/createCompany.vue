<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Carte principale -->
    <div
      class="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl relative"
    >
      <!-- En-tête -->
      <div>
        <div class="flex justify-center">
          <div
            class="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <svg
              class="h-8 w-8 text-white"
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
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Ajouter une entreprise
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enregistrez une nouvelle entreprise dans votre recherche de stage
        </p>
      </div>

      <!-- Formulaire -->
      <form class="mt-8 space-y-6" @submit.prevent="createCompany">
        <div class="grid grid-cols-1 gap-6">
          <!-- Nom de l'entreprise -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              <span class="flex items-center">
                <svg
                  class="h-4 w-4 mr-1 text-gray-500"
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
                Nom de l'entreprise *
              </span>
            </label>
            <input
              id="name"
              v-model="company.name"
              type="text"
              required
              class="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              "
              placeholder="Ex: Google France"
              @blur="validateField('name')"
              @input="errors.name = ''"
            />
            <p
              v-if="errors.name"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errors.name }}
            </p>
          </div>

          <!-- Site web -->
          <div>
            <label
              for="webSite"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              <span class="flex items-center">
                <svg
                  class="h-4 w-4 mr-1 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                  />
                </svg>
                Site web
              </span>
            </label>
            <input
              id="webSite"
              v-model="company.webSite"
              type="url"
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="https://www.entreprise.com"
              @blur="validateField('webSite')"
              @input="errors.webSite = ''"
            />
            <p
              v-if="errors.webSite"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errors.webSite }}
            </p>
          </div>

          <!-- Type et Secteur - 2 colonnes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Taille -->
            <div>
              <label
                for="size"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                <span class="flex items-center">
                  <svg
                    class="h-4 w-4 mr-1 text-gray-500"
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
                  Taille *
                </span>
              </label>
              <select
                id="size"
                v-model="company.size"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="">Sélectionner</option>
                <option
                  v-for="size in COMPANY_SIZES"
                  :key="size.value"
                  :value="size.value"
                >
                  {{ size.label }}
                </option>
              </select>
            </div>
            <!-- Secteur -->
            <div>
              <label
                for="sector"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                <span class="flex items-center">
                  <svg
                    class="h-4 w-4 mr-1 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                  Secteur *
                </span>
              </label>
              <select
                id="sector"
                v-model="company.sector"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="">Sélectionner</option>
                <option
                  v-for="sector in COMPANY_SECTORS"
                  :key="sector.value"
                  :value="sector.value"
                >
                  {{ sector.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                v-if="!isLoading"
                class="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <svg
                v-else
                class="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? "Ajout en cours..." : "Ajouter l'entreprise" }}
            </button>
            <button
              type="button"
              @click="router.push('/createApplication')"
              class="py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Retourner
            </button>
          </div>
        </div>
      </form>

      <!-- ✅ Composant Notification -->
      <Notification
        v-if="notification.show"
        :message="notification.message"
        :sub-message="notification.subMessage"
        :type="notification.type"
        @close="closeNotification"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useCompanyStore } from "../store/company";
import { COMPANY_SECTORS } from "../data/companySectores";
import { COMPANY_SIZES } from "../data/companySizes";
import type { Company } from "../interfaces/Company";
// ✅ Importer le composant Notification
import Notification from "../components/Notification.vue";

const router = useRouter();
const companyStore = useCompanyStore();
// Liaison directe avec l'objet réactif du store pour que les valeurs soient conservées lors des allers-retours
const company: Company = reactive(companyStore.company);

const isLoading = ref(false);
const generalError = ref("");
const successMessage = ref("");

// ✅ Notification
const notification = reactive({
  show: false,
  message: "",
  subMessage: "",
  type: "success" as "success" | "error",
});

const errors = reactive({
  name: "",
  webSite: "",
});

const validateField = (field: keyof typeof errors) => {
  switch (field) {
    case "name":
      if (company.name != "" && company.name.trim().length < 2) {
        errors.name = "Le nom doit contenir au moins 2 caractères";
      } else if (company.name.length > 100) {
        errors.name = "Le nom ne doit pas dépasser 100 caractères";
      } else {
        errors.name = "";
      }
      break;

    case "webSite":
      if (company.webSite && !/^https?:\/\/[^\s]+$/.test(company.webSite)) {
        errors.webSite = "L'URL doit commencer par http:// ou https://";
      } else {
        errors.webSite = "";
      }
      break;
  }
};

const isFormValid = computed(() => {
  validateField("name");
  return (
    company.name.trim().length >= 2 && company.sector.length > 0 && !errors.name
  );
});

// ✅ Fermer la notification
const closeNotification = () => {
  notification.show = false;
};

const createCompany = () => {
  validateField("name");
  validateField("webSite");

  const hasErrors = Object.values(errors).some((err) => err !== "");
  if (hasErrors || !isFormValid.value) {
    // ✅ Utiliser la notification pour l'erreur
    notification.show = true;
    notification.type = "error";
    notification.message = "❌ Formulaire invalide";
    notification.subMessage =
      "Veuillez corriger les erreurs dans le formulaire";
    return;
  }

  isLoading.value = true;
  generalError.value = "";
  successMessage.value = "";

  try {
    const res = companyStore.createCompany(company);
    if (res && res._id) {
      // ✅ Notification de succès
      notification.show = true;
      notification.type = "success";
      notification.message = "✅ Entreprise ajoutée avec succès !";
      notification.subMessage = `"${company.name}" a été enregistrée`;

      successMessage.value = "Entreprise ajoutée avec succès !";
      companyStore.resetCompanyForm(); // vide le formulaire

      // ✅ Fermer automatiquement après 5 secondes
      setTimeout(() => {
        closeNotification();
      }, 5000);
    } else {
      // ✅ Notification d'erreur
      notification.show = true;
      notification.type = "error";
      notification.message = "❌ Erreur lors de l'ajout";
      notification.subMessage = "Veuillez réessayer";

      generalError.value = "Erreur lors de l'ajout de l'entreprise";
    }
  } catch (error: any) {
    // ✅ Notification d'erreur
    notification.show = true;
    notification.type = "error";
    notification.message = "❌ Une erreur est survenue";
    notification.subMessage = error.message || "Veuillez réessayer";

    generalError.value = error.message || "Une erreur est survenue";
    console.error("Erreur création entreprise:", error);

    setTimeout(() => {
      closeNotification();
    }, 5000);
  } finally {
    isLoading.value = false;
  }
};

// Nettoyer les erreurs en temps réel
watch(
  () => company.name,
  () => {
    if (errors.name) errors.name = "";
  },
);
watch(
  () => company.webSite,
  () => {
    if (errors.webSite) errors.webSite = "";
  },
);
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
