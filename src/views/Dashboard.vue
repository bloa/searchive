<template>
  <div>
    <h1>🏠 Accueil</h1>
    <p>Bienvenue sur mon application Vue !</p>
    <button @click="goToAbout">Aller à propos</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goToAbout() {
  router.push("/about");
  // ou router.push({ name: 'about' })
}
</script>
