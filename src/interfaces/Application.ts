import type { Company } from "./Company";

export interface Application {
  _id?: string;
  title: string;
  companyID: string;
  company?: Company;
  status:
    | "pending"
    | "call"
    | "HRInterview"
    | "technicalInterview"
    | "accepted"
    | "refused";
  offerSource:
    | "Connaissance"
    | "EnPhysique"
    | "LinkedIn"
    | "Indeed"
    | "HelloWork"
    | "JobTeaser"
    | "Other";
  offerUrl: string;
  date: string;
  responseDate?: string;
  HRInterviewDate?: string;
  technicalInterviewDate?: string;
  acceptationDate?: string;
  phoneIndex?: number;
  phone?: number;
  email?: string;
  city: string;
  postalCode: number;
  statusHistory?: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: Application["status"];
  date: string; // format YYYY-MM-DD
}
