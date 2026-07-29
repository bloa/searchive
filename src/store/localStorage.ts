import { defineStore } from "pinia";

export const useLocalStorage = defineStore("localStore", () => {
  const getItem = <T>(key: string): T | null => {
    const val = localStorage.getItem(key);
    if (val === null) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as unknown as T;
    }
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
