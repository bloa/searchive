<template>
  <div>
    <h1>🏠 Accueil</h1>

    {{ counter }}
    <button @click="increment">inc</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLocalStorage } from "../store/localStorage";

const storage = useLocalStorage();
const saved = storage.getItem<number>("counter");
const counter = ref<number>(saved !== null ? saved : 0);
function increment() {
  counter.value++;
  storage.setItem("counter", counter.value);
}
</script>
