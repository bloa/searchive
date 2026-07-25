<template>
  <div id="app">
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
