import {
  faBan,
  faCircleCheck,
  faCircleXmark,
  faCode,
  faComments,
  faPaperPlane,
  faMagnifyingGlass,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

export const APPLICATION_STATUSES = {
  sent: {
    label: "Envoyée",
    icon: faPaperPlane,
    color: "#93C5FD",
    group: "processing",
  },
  screening: {
    label: "En cours d'examen",
    icon: faMagnifyingGlass,
    color: "#3B82F6",
    group: "processing",
  },
  interview: {
    label: "Entretien",
    icon: faComments,
    color: "#8B5CF6",
    group: "interview",
  },
  assignment: {
    label: "Travail à préparer",
    icon: faClipboardList,
    color: "#FBBF24",
    group: "interview",
  },
  technical: {
    label: "Évaluation technique",
    icon: faCode,
    color: "#F97316",
    group: "interview",
  },
  accepted: {
    label: "Acceptée",
    icon: faCircleCheck,
    color: "#16A34A",
    group: "finished",
  },
  refused: {
    label: "Sans suite",
    icon: faCircleXmark,
    color: "#DC2626",
    group: "finished",
  },
  abandoned: {
    label: "Abandonnée",
    icon: faBan,
    color: "#6B7280",
    group: "finished",
  },
} as const;