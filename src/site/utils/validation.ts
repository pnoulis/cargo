/**
 * Validation helper functions for forms
 */

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

export function validateDimension(value: string | number): {
  valid: boolean;
  error?: string;
} {
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

export function validateWeight(value: string | number | undefined): {
  valid: boolean;
  error?: string;
} {
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

export function validatePriority(value: string | number | undefined): {
  valid: boolean;
  error?: string;
} {
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

export function validateQuantity(value: string | number | undefined): {
  valid: boolean;
  error?: string;
} {
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
