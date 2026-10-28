import { faBriefcase, faClock, faFlagCheckered, faGears } from "@fortawesome/free-solid-svg-icons";
import { APPLICATION_STATUSES } from "./applicationStatuses";

export const APPLICATION_GROUPS = {
  total: {
    label: "Total",
    icon: faBriefcase,
    color: APPLICATION_STATUSES.abandoned.color
  },
  processing: {
    label: "En attente",
    icon: faClock,
    color: APPLICATION_STATUSES.screening.color,
  },
  interview: {
    label: "En cours",
    icon: faGears,
    color: APPLICATION_STATUSES.interview.color,
  },
  finished: {
    label: "Terminées",
    icon: faFlagCheckered,
    color: APPLICATION_STATUSES.accepted.color,
  },
} as const;