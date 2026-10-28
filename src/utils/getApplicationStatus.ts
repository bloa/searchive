import type { Application, ApplicationStatus } from "../interfaces/Application";

export function getApplicationStatus(app: Application): ApplicationStatus {
  const dates = app.statusDates;
  if (dates.abandoned) return "abandoned";
  if (dates.accepted) return "accepted";
  if (dates.refused) return "refused";
  if (dates.technical) return "interview";
  if (dates.assignment) return "assignment";
  if (dates.interview) return "interview";
  if (dates.screening) return "screening";
  return "sent";
}