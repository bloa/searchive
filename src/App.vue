<template>
  <div id="app">
    <header>
      <!-- Liens de navigation -->
      <nav>
        <router-link to="/">Accueil</router-link>
        <router-link to="/about">À propos</router-link>
        <router-link :to="{ name: 'user', params: { id: 123 } }">
          Utilisateur 123
        </router-link>
      </nav>
    </header>

    <!-- Zone d'affichage des pages -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Pas besoin d'import supplémentaire
</script>

<style scoped>
nav {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* Style du lien actif */
.router-link-active {
  font-weight: bold;
  color: #42b883;
}

.router-link-exact-active {
  color: #42b883;
}
</style>
