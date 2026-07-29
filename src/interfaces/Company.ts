export interface Company {
  _id?: string;
  name: string;
  webSite?: string;
  sector: string;
  size?: "1-10" | "11-50" | "51-100" | "101-1000" | "1001+";
}
