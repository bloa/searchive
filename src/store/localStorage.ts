import { defineStore } from "pinia";
import { testApplications, testCompanies } from "../data/testData";

export const useLocalStorage = defineStore("localStore", () => {
  const getItem = (key: string, defaultReturn?: any) => {
    const val = localStorage.getItem(key);
    if (val === null) return defaultReturn;
    return JSON.parse(val);
  };
  const setItem = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  const fillTestData = () => {
    const companies = getItem("companies", []);
    if (companies.length == 0) {
      return;
    }
    setItem("companies", testCompanies);
    setItem("applications", testApplications);
  };

  // Tout exporter
  return {
    getItem,
    setItem,
    fillTestData,
  };
});
