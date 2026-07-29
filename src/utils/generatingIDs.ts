import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

// UUID v4 (aléatoire)
const id = uuidv4(); // "123e4567-e89b-12d3-a456-426614174000"

// UUID v7 (chronologique)
const id7 = uuidv7(); // "018f0a1a-2b3c-4d5e-6f7g-8h9i0j1k2l3m"

// Fonction personnalisée
export function generateId(): string {
  return uuidv4();
}
