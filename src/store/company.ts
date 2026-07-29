import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useLocalStorage } from "./localStorage";
import type { Company } from "../interfaces/Company";

export const useCompanyStore = defineStore("companyStore", () => {
  const storage = useLocalStorage();
  const STORAGE_KEY = "companies";

  const companies = ref<Company[]>(
    storage.getItem<Company[]>(STORAGE_KEY) || [],
  );

  const company = reactive<Company>({
    name: "",
    webSite: "",
    type: "",
    sector: "",
  });

  function save() {
    storage.setItem(STORAGE_KEY, companies.value);
  }

  function createCompany(data: Company): Company | null {
    const newCompany: Company = {
      ...data,
      _id: crypto.randomUUID?.() ?? Date.now().toString(),
    };
    companies.value.push(newCompany);
    save();
    return newCompany;
  }

  function resetCompanyForm() {
    company.name = "";
    company.webSite = "";
    company.type = "";
    company.sector = "";
  }

  return {
    companies,
    company,
    createCompany,
    resetCompanyForm,
  };
});
