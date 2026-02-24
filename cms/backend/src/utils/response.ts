import { Response } from "express";

export class ResponseHandler {
  static success(res: Response, data: any, message?: string, statusCode = 200) {
    res.status(statusCode).json({ success: true, data, ...(message && { message }) });
  }

  static error(res: Response, code: string, message: string, statusCode = 500) {
    res.status(statusCode).json({ success: false, error: { code, message } });
  }

  static notFound(res: Response, message = "Resource not found") {
    this.error(res, "NOT_FOUND", message, 404);
  }

  static validationError(res: Response, details: Record<string, string>) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Validation failed", details } });
  }

  static formatValidationErrors(error: any): Record<string, string> {
    const errors: Record<string, string> = {};
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
    }
    return errors;
  }
}
