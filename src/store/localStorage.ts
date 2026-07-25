import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useLocalStorage = defineStore("localStore", () => {
  const getItem = (key: string): any => {
    return localStorage.getItem(key);
  };
  const setItem = (key: string, value: any): void => {
    localStorage.setItem(key, value);
  };

  // Tout exporter
  return {
    getItem,
    setItem,
  };
});
