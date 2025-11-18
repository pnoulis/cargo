import { randomUUID } from "crypto";

export function generateID(): string {
  return randomUUID();
}

export function smallID(): string {
  return Math.random().toString(36).substring(2, 9);
}
