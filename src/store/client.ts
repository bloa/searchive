import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./localStorage";

export const useClientStore = defineStore("clientStore", () => {
  const storageKey = "clientID";
  const storage = useLocalStorage();

  // State
  const clientID = ref<string>(storage.getItem(storageKey, ""));
  if (clientID.value === "") resetClientID();

  // Actions
  function resetClientID() {
    setClientID(uuidv4());
  }

  function setClientID(id: string) {
    clientID.value = id;
    storage.setItem(storageKey, clientID.value);
  }

  return {
    clientID,
    setClientID,
  };
});
