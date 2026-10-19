import { v4 as uuidv4 } from "uuid";

// Fonction personnalisée
export function generateId(): string {
  return uuidv4();
}
