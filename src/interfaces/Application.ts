import { APPLICATION_GROUPS } from "../data/applicationGroups.ts";
import { APPLICATION_METHODS } from "../data/applicationMethods.ts";
import { APPLICATION_STATUSES } from "../data/applicationStatuses.ts";
import { COMPANY_SIZES } from "../data/companySizes.ts";
import { COMPANY_SECTORS } from "../data/companySectors.ts";
import { OFFER_SOURCES } from "../data/offerSource.ts";

export type ApplicationStatus = keyof typeof APPLICATION_STATUSES;
export type ApplicationGroup = keyof typeof APPLICATION_GROUPS;
export type ApplicationMethod = (typeof APPLICATION_METHODS)[number]["value"];
export type OfferSource = (typeof OFFER_SOURCES)[number]["value"];
export type CompanySize = (typeof COMPANY_SIZES)[number]["value"];
export type CompanySector = (typeof COMPANY_SECTORS)[number]["value"];

export interface Application {
  _id?: string;
  title: string;
  companyName: string;
  companyCity: string;
  companySize: CompanySize;
  companySector: CompanySector;
  offerSource: OfferSource;
  applicationMethod: ApplicationMethod;
  statusDates: Partial<Record<ApplicationStatus, string>>; // date format YYYY-MM-DD
  additionalInfo: string;
  timestamp: number;
}