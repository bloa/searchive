import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useLocalStorage } from "./localStorage";
import type { Company } from "../interfaces/Company";
import { generateId } from "../utils/generatingIDs";

export const useCompanyStore = defineStore("companyStore", () => {
  const storage = useLocalStorage();
  const STORAGE_KEY = "companies";

  const companies = ref<Company[]>(storage.getItem(STORAGE_KEY, []));

  const company = reactive<Company>({
    name: "",
    webSite: "",
    sector: "",
    size: "1-10",
  });

  function save() {
    storage.setItem(STORAGE_KEY, companies.value);
  }

  function createCompany(data: Company): Company | null {
    const newCompany: Company = {
      ...data,
      _id: generateId(),
    };
    companies.value.push(newCompany);
    save();
    return newCompany;
  }

  function resetCompanyForm() {
    company.name = "";
    company.webSite = "";
    company.sector = "";
  }

  return {
    companies,
    company,
    createCompany,
    resetCompanyForm,
  };
});
