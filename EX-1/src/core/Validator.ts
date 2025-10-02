import { ApplicationError } from "./ErrorHandler";

export class Validator {
  public static isNotEmpty(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new ApplicationError(
        `${fieldName} cannot be empty`,
        'VALIDATION_ERROR'
      );
    }
  }

  public static isPositiveNumber(value: number, fieldName: string): void {
    if (value <= 0 || isNaN(value)) {
      throw new ApplicationError(
        `${fieldName} must be a positive number`,
        'VALIDATION_ERROR'
      );
    }
  }

  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static isInRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min || value > max) {
      throw new ApplicationError(
        `${fieldName} must be between ${min} and ${max}`,
        'VALIDATION_ERROR'
      );
    }
  }
}
