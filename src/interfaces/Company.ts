export interface Company {
  _id?: string;
  name: string;
  webSite?: string;
  type: string;
  sector: string;
  taille?: "1 à 10" | "11 à 50" | "51 à 100" | "101 à 1000" | "1001 et plus";
}
