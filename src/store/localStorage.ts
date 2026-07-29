import { defineStore } from "pinia";

export const useLocalStorage = defineStore("localStore", () => {
  const getItem = (key: string): any | null => {
    const res = localStorage.getItem(key);
    if (res != null) {
      return JSON.parse(res);
    }
    return res;
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
