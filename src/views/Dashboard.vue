<template>
  <div>
    <h1>🏠 Accueil</h1>

    {{ counter }}
    <button @click="increment">inc</button>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from "../store/localStorage";
import { ref, type Ref } from "vue";

const counter: Ref<number> = ref(0);
const increment = () => {
  const newVal = counter.value + 1;
  useLocalStorage().setItem("counter", JSON.stringify(newVal));
  counter.value = JSON.parse(useLocalStorage().getItem("counter"));
};
</script>
