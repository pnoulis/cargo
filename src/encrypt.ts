import { randomUUID } from "crypto";

export function generateID(): string {
  return randomUUID();
}
