import { defineStore } from "pinia";

export const useLocalStorage = defineStore("localStore", () => {
  const getItem = (key: string, defaultReturn?: any) => {
    const val = localStorage.getItem(key);
    if (val === null) return defaultReturn;
    return JSON.parse(val);
  };
  const setItem = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Tout exporter
  return {
    getItem,
    setItem,
  };
});
