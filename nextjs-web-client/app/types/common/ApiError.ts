import { ApiProblemDetails } from "./ApiProblemDetails ";

export class ApiError extends Error {
  status?: number;
  title?: string;
  detail?: string;
  traceId?: string;
  errorCodes?: string[];
  validationErrors?: Record<string, string[]>;

  constructor(problem: ApiProblemDetails) {
    super(problem.detail || problem.title || "Có lỗi xảy ra");

    this.name = "ApiError";
    this.status = problem.status;
    this.title = problem.title;
    this.detail = problem.detail;
    this.traceId = problem.traceId;
    this.errorCodes = problem.errorCodes;
    this.validationErrors = problem.errors;
  }
}
