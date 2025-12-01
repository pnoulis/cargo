import { randomUUID } from "crypto";

export function generateID(): string {
  return `${Math.random().toString(36).slice(2, 9)}`;
}

export function smallID(): string {
  return Math.random().toString(36).substring(2, 9);
}
