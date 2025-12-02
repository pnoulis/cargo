/**
 * Validation helper functions for forms
 */

type TValidationResult = {
  valid: boolean;
  error?: string;
};

type TParseResult = TValidationResult & {
  value: unknown;
};

export function isPositiveNumber(value: string | number): boolean {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
}

export function isNonNegativeNumber(value: string | number): boolean {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0;
}

export function isInRange(value: string | number, min: number, max: number): boolean {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return !isNaN(num) && num >= min && num <= max;
}

export function validateDimension(value: string | number): TValidationResult {
  if (!value) {
    return { valid: false, error: "Required" };
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (num <= 0) {
    return { valid: false, error: "Must be greater than 0" };
  }

  if (num > 10000) {
    return { valid: false, error: "Value too large" };
  }

  return { valid: true };
}

export function validateWeight(value: string | number | undefined): TValidationResult {
  if (!value) {
    return { valid: true }; // Optional field
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (num < 0) {
    return { valid: false, error: "Must be non-negative" };
  }

  if (num > 100000) {
    return { valid: false, error: "Value too large" };
  }

  return { valid: true };
}

export function validatePriority(value: string | number | undefined): TValidationResult {
  if (!value) {
    return { valid: true }; // Optional field
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: "Must be a whole number" };
  }

  if (!isInRange(num, 0, 100)) {
    return { valid: false, error: "Must be between 0 and 100" };
  }

  return { valid: true };
}

export function validateQuantity(value: string | number | undefined): TValidationResult {
  if (!value) {
    return { valid: true }; // Optional field, defaults to 1
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: "Must be a whole number" };
  }

  if (num < 1) {
    return { valid: false, error: "Must be at least 1" };
  }

  if (num > 1000) {
    return { valid: false, error: "Value too large" };
  }

  return { valid: true };
}

function round3(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function parseContainerUpdate(name: string, value: unknown): TParseResult {
  let parsed;

  switch (name) {
    case "l":
      parsed = round3(parseFloat(value));
      if (!parsed) return { valid: true, value: 0 };
      return { ...validateDimension(parsed), value: parsed };
    case "w":
      parsed = round3(parseFloat(value));
      if (!parsed) return { valid: true, value: 0 };
      return { ...validateDimension(parsed), value: parsed };
    case "h":
      parsed = round3(parseFloat(value));
      if (!parsed) return { valid: true, value: 0 };
      return { ...validateDimension(parsed), value: parsed };
    case "maxWeight":
      parsed = round3(parseFloat(value));
      if (!parsed) return { valid: true, value: 0 };
      return { ...validateWeight(parsed), value: parsed };
    case "weight":
      parsed = round3(parseFloat(value));
      if (!parsed) return { valid: true, value: 0 };
      return { ...validateWeight(parsed), value: parsed };
    case "clearance":
    default:
      throw new Error(`Trying to update unknown property: ${name}`);
  }
}

export function validateCargo(name: string, value: unknown): TValidationResult {}
