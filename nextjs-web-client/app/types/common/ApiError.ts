import { ApiProblemDetails } from "./ApiProblemDetails ";

export class ApiError extends Error {
  readonly status?: number;
  readonly title?: string;
  readonly detail?: string;
  readonly type?: string;
  readonly instance?: string;

  readonly traceId?: string;

  readonly errorCodes: string[];
  readonly errors?: Record<string, string[]>;

  constructor(problem: ApiProblemDetails) {
    super(problem.detail ?? problem.title ?? "Có lỗi xảy ra");

    this.name = "ApiError";

    this.status = problem.status;
    this.title = problem.title;
    this.detail = problem.detail;
    this.type = problem.type;
    this.instance = problem.instance;

    this.traceId = problem.traceId;

    this.errorCodes = problem.errorCodes ?? [];
    this.errors = problem.errors;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  getDisplayMessage(): string {
    if (this.detail) {
      return this.detail;
    }

    if (this.errors) {
      const first = Object.values(this.errors).flat()[0];

      if (first) {
        return first;
      }
    }

    if (this.title) {
      return this.title;
    }

    return "Có lỗi xảy ra.";
  }

  getValidationMessages(): string[] {
    if (!this.errors) return [];

    return Object.values(this.errors).flat();
  }

  getFieldErrors(field: string): string[] {
    return this.errors?.[field] ?? [];
  }

  isValidationError(): boolean {
    return this.status === 400 && this.errors !== undefined;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isConflict(): boolean {
    return this.status === 409;
  }
}
