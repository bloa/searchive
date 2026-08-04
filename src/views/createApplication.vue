<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <Notification
      v-if="notification.show"
      :message="notification.message"
      :sub-message="notification.subMessage"
      :type="notification.type"
      @close="notification.show = false"
    />
    <!-- Carte principale -->
    <div class="max-w-3xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Ajouter une candidature
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enregistrez une nouvelle candidature dans votre recherche de stage
        </p>
      </div>

      <!-- Formulaire -->
      <form class="mt-8 space-y-6" @submit.prevent="createApplication">
        <div class="grid grid-cols-1 gap-6">
          <!-- Titre du poste -->
          <div>
            <label
              for="title"
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Titre du poste *
              </span>
            </label>
            <input
              id="title"
              v-model="application.title"
              type="text"
              required
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              "
              placeholder="Ex: Ingénieur Full Stack"
              @blur="validateField('title')"
              @input="errors.title = ''"
            />
            <p
              v-if="errors.title"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errors.title }}
            </p>
          </div>

          <!-- Entreprise et Statut - 2 colonnes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Sélecteur Entreprise -->
            <div>
              <label
                for="company"
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
                  Entreprise *
                </span>
              </label>
              <div class="flex gap-2">
                <select
                  id="company"
                  v-model="application.companyID"
                  required
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
                  :class="
                    errors.companyID
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  "
                  @blur="validateField('companyID')"
                  @change="errors.companyID = ''"
                >
                  <option value="">Sélectionner une entreprise</option>
                  <option
                    v-for="company in companies"
                    :key="company._id"
                    :value="company._id"
                  >
                    {{ company.name }}
                  </option>
                </select>
                <button
                  type="button"
                  @click="addCompany"
                  class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 whitespace-nowrap"
                  title="Ajouter une nouvelle entreprise"
                >
                  <svg
                    class="h-5 w-5"
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
                </button>
              </div>
              <p
                v-if="errors.companyID"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.companyID }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                Vous ne trouvez pas l'entreprise ? Cliquez sur le bouton +
              </p>
            </div>

            <!-- Statut -->
            <div>
              <label
                for="status"
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Statut *
                </span>
              </label>
              <select
                id="status"
                v-model="application.status"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="">Sélectionner un statut</option>
                <option
                  v-for="status in APPLICATION_STATUSES"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Source et URL - 2 colonnes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Source de l'offre -->
            <div>
              <label
                for="offerSource"
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Source *
                </span>
              </label>
              <select
                id="offerSource"
                v-model="application.offerSource"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="">Sélectionner une source</option>
                <option
                  v-for="source in OFFER_SOURCES"
                  :key="source.value"
                  :value="source.value"
                >
                  {{ source.label }}
                </option>
              </select>
            </div>

            <!-- URL de l'offre -->
            <div>
              <label
                for="offerUrl"
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  URL de l'offre
                </span>
              </label>
              <input
                id="offerUrl"
                v-model="application.offerUrl"
                type="text"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="
                  errors.offerUrl
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                "
                placeholder="https://www.example.com/offre"
                @blur="validateField('offerUrl')"
                @input="errors.offerUrl = ''"
              />
              <p
                v-if="errors.offerUrl"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.offerUrl }}
              </p>
            </div>
          </div>

          <!-- Date de candidature -->
          <div>
            <label
              for="date"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Date candidature *
              </span>
            </label>
            <input
              id="date"
              v-model="application.date"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="
                errors.date
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              "
              @blur="validateField('date')"
              @input="errors.date = ''"
            />
            <p
              v-if="errors.date"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errors.date }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email
              </span>
            </label>
            <input
              id="email"
              v-model="application.email"
              type="email"
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              "
              placeholder="contact@entreprise.com"
              @blur="validateField('email')"
              @input="errors.email = ''"
            />
            <p
              v-if="errors.email"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errors.email }}
            </p>
          </div>

          <!-- Téléphone - Version corrigée -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Téléphone
              </span>
            </label>
            <div class="flex items-center gap-2">
              <!-- ✅ Indicatif téléphonique avec + fixe et limite à 3 chiffres -->
              <div class="relative w-28">
                <span
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 font-medium"
                >
                  +
                </span>
                <input
                  type="number"
                  placeholder="33"
                  v-model="application.phoneIndex"
                  class="w-14 py-3 pl-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  @blur="validateField('phoneIndex')"
                  @input="phoneIndexInput()"
                  :class="
                    errors.phoneIndex
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  "
                />
              </div>

              <!-- ✅ Numéro de téléphone -->
              <input
                :value="phoneDisplay"
                type="text"
                inputmode="numeric"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                "
                placeholder="123456789"
                @input="updatePhone"
                @blur="validateField('phone')"
              />
            </div>
            <!-- ✅ Message d'erreur pour phoneIndex -->
            <p
              v-if="errors.phoneIndex"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errors.phoneIndex }}
            </p>
            <!-- ✅ Message d'erreur pour phone -->
            <p
              v-if="errors.phone"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ errors.phone }}
            </p>
          </div>

          <!-- Ville et Code postal - 2 colonnes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                for="city"
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Ville *
                </span>
              </label>
              <input
                id="city"
                v-model="application.city"
                type="text"
                required
                class="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="
                  errors.city
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                "
                placeholder="Paris"
                @blur="validateField('city')"
                @input="errors.city = ''"
              />
              <p
                v-if="errors.city"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.city }}
              </p>
            </div>

            <div>
              <label
                for="postalCode"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Code postal *
                </span>
              </label>
              <input
                id="postalCode"
                v-model.number="application.postalCode"
                type="number"
                required
                class="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="
                  errors.postalCode
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                "
                placeholder="75001"
                @blur="validateField('postalCode')"
                @input="errors.postalCode = ''"
              />
              <p
                v-if="errors.postalCode"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.postalCode }}
              </p>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
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
              {{ isLoading ? "Ajout en cours..." : "Ajouter la candidature" }}
            </button>
            <button
              type="button"
              @click="router.push('/')"
              class="py-3 cursor-pointer px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from "vue";
import { APPLICATION_STATUSES } from "../data/applicationStatus";
import { OFFER_SOURCES } from "../data/offerSource";
import type { Application } from "../interfaces/Application";
import { useApplicationStore } from "../store/application";
import { useCompanyStore } from "../store/company";
import { useRouter } from "vue-router";
import Notification from "../components/Notification.vue";
// Stores
const applicationStore = useApplicationStore();
const companyStore = useCompanyStore();
const router = useRouter();

// ✅ États d'affichage
const isLoading = ref(false);

// ✅ États d'erreur
const errors = reactive({
  title: "",
  companyID: "",
  offerUrl: "",
  date: "",
  email: "",
  phoneIndex: "",
  phone: "",
  city: "",
  postalCode: "",
});
const notification = reactive({
  show: false,
  message: "",
  subMessage: "",
  type: "success" as "success" | "error",
});
// ✅ État du formulaire
const application: Application = applicationStore.$state.application;
const companies = companyStore.$state.companies;

// ✅ Computed pour l'affichage du phone
const phoneDisplay = computed({
  get: () => application.phone?.toString() || "",
  set: (value: string) => {
    const clean = value.replace(/\D/g, "");
    application.phone = clean ? parseInt(clean) : undefined;
  },
});

// ✅ Mise à jour du phone
const updatePhone = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const clean = input.value.replace(/\D/g, "");
  input.value = clean;
  application.phone = clean ? parseInt(clean) : undefined;
};

// ✅ Validation des champs
const validateField = (field: keyof typeof errors) => {
  switch (field) {
    case "title":
      if (!application.title || application.title.trim().length < 3) {
        errors.title = "Le titre doit contenir au moins 3 caractères";
      } else if (application.title.length > 100) {
        errors.title = "Le titre ne doit pas dépasser 100 caractères";
      } else {
        errors.title = "";
      }
      break;

    case "companyID":
      if (!application.companyID) {
        errors.companyID = "Veuillez sélectionner une entreprise";
      } else {
        errors.companyID = "";
      }
      break;

    case "offerUrl":
      if (
        application.offerUrl &&
        !/^https?:\/\/[^\s]+$/.test(application.offerUrl)
      ) {
        errors.offerUrl = "L'URL doit commencer par http:// ou https://";
      } else {
        errors.offerUrl = "";
      }
      break;

    case "date":
      if (!application.date) {
        errors.date = "La date de candidature est requise";
      } else {
        errors.date = "";
      }
      break;

    case "email":
      if (
        application.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)
      ) {
        errors.email = "Veuillez entrer une adresse email valide";
      } else {
        errors.email = "";
      }
      break;

    case "phoneIndex":
      const indexStr = application.phoneIndex?.toString() || "";
      if (application.phoneIndex && indexStr.length > 3) {
        errors.phoneIndex = "L'indicatif doit contenir au maximum 3 chiffres";
      } else if (application.phoneIndex && !/^\d{1,3}$/.test(indexStr)) {
        errors.phoneIndex = "L'indicatif ne doit contenir que des chiffres";
      } else {
        errors.phoneIndex = "";
      }
      break;

    case "phone":
      const phoneStr = application.phone?.toString() || "";
      if (application.phone && phoneStr.length < 9) {
        errors.phone = "Le numéro doit contenir au moins 9 chiffres";
      } else if (application.phone && phoneStr.length > 15) {
        errors.phone = "Le numéro est trop long";
      } else if (application.phone && !/^\d+$/.test(phoneStr)) {
        errors.phone = "Le numéro ne doit contenir que des chiffres";
      } else {
        errors.phone = "";
      }
      break;

    case "city":
      if (!application.city || application.city.trim().length < 2) {
        errors.city = "La ville doit contenir au moins 2 caractères";
      } else {
        errors.city = "";
      }
      break;

    case "postalCode":
      const postalStr = application.postalCode?.toString() || "";
      if (!postalStr || postalStr.length < 4 || postalStr.length > 5) {
        errors.postalCode = "Le code postal doit contenir 4 ou 5 chiffres";
      } else if (!/^\d{4,5}$/.test(postalStr)) {
        errors.postalCode = "Le code postal ne doit contenir que des chiffres";
      } else {
        errors.postalCode = "";
      }
      break;
  }
};

// ✅ Validation du formulaire complet
const isFormValid = computed(() => {
  // Valider tous les champs
  validateField("title");
  validateField("companyID");
  validateField("offerUrl");
  validateField("date");
  validateField("email");
  validateField("phoneIndex");
  validateField("phone");
  validateField("city");
  validateField("postalCode");

  return (
    application.title.trim().length >= 3 &&
    application.companyID.length > 0 &&
    application.offerSource.length > 0 &&
    application.date.length > 0 &&
    application.city.trim().length >= 2 &&
    application.postalCode !== undefined &&
    application.postalCode.toString().length >= 4 &&
    !errors.title &&
    !errors.companyID &&
    !errors.offerUrl &&
    !errors.date &&
    !errors.email &&
    !errors.phoneIndex &&
    !errors.phone &&
    !errors.city &&
    !errors.postalCode
  );
});

const phoneIndexInput = () => {
  errors.phoneIndex = "";
  if (application.phoneIndex! > 999) {
    application.phoneIndex = 0;
  }
};

// ✅ Ajouter une entreprise
const addCompany = () => {
  applicationStore.setApplication(application);
  router.push("/createCompany");
};

// ✅ Créer la candidature
const createApplication = async () => {
  // Valider tous les champs avant soumission
  validateField("title");
  validateField("companyID");
  validateField("offerUrl");
  validateField("date");
  validateField("email");
  validateField("phoneIndex");
  validateField("phone");
  validateField("city");
  validateField("postalCode");

  // Vérifier les erreurs
  const hasErrors = Object.values(errors).some((err) => err !== "");
  if (hasErrors || !isFormValid.value) {
    return;
  }

  isLoading.value = true;

  try {
    const res = applicationStore.create(application);

    if (res && res._id) {
      resetForm();
      // ✅ Afficher la notification
      notification.show = true;
      notification.type = "success";
      notification.message = "✅ Candidature ajoutée avec succès !";
      notification.subMessage = `"${application.title}" a été enregistrée`;
    }
  } catch (error) {
    console.error("Erreur lors de la création:", error);
  } finally {
    isLoading.value = false;
  }
};

// ✅ Réinitialiser le formulaire
const resetForm = () => {
  application.title = "";
  application.companyID = "";
  application.status = "pending";
  application.offerSource = "LinkedIn";
  application.offerUrl = "";
  application.date = new Date().toISOString().split("T")[0] as string;
  application.responseDate = "";
  application.HRInterviewDate = "";
  application.technicalInterviewDate = "";
  application.email = "";
  application.phone = undefined;
  application.phoneIndex = 33;
  application.city = "";
  application.postalCode = 35000;

  // Réinitialiser les erreurs
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

// ✅ Nettoyer les erreurs en temps réel
watch(
  () => application.title,
  () => {
    if (errors.title) errors.title = "";
  },
);
watch(
  () => application.companyID,
  () => {
    if (errors.companyID) errors.companyID = "";
  },
);
watch(
  () => application.offerUrl,
  () => {
    if (errors.offerUrl) errors.offerUrl = "";
  },
);
watch(
  () => application.date,
  () => {
    if (errors.date) errors.date = "";
  },
);
watch(
  () => application.email,
  () => {
    if (errors.email) errors.email = "";
  },
);
watch(
  () => application.phoneIndex,
  () => {
    if (errors.phoneIndex) errors.phoneIndex = "";
  },
);
watch(
  () => application.phone,
  () => {
    if (errors.phone) errors.phone = "";
  },
);
watch(
  () => application.city,
  () => {
    if (errors.city) errors.city = "";
  },
);
watch(
  () => application.postalCode,
  () => {
    if (errors.postalCode) errors.postalCode = "";
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

/* ✅ Supprimer les flèches des inputs number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
