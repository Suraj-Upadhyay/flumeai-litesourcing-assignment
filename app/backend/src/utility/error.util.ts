/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SoftError {
  name: string;
  error: ApiError;
}

export class ApiError extends Error {
  status: number;
  data: any;
  message: string;
  success: boolean;
  errors?: SoftError[];
  stack?: string | undefined;

  constructor(
    status: number,
    message = "Internal server error",
    errors?: SoftError[],
    stack?: any,
  ) {
    super(message);
    this.status = status;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    const errors = this.errors
      ? this.errors.map((error): any => {
          return {
            name: error.name,
            error: error.error.toJSON(),
          };
        })
      : null;
    return {
      status: this.status,
      success: this.success,
      message: this.message,
      errors: errors,
      data: this.data,
    };
  }
}

export class InternalServerError extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(500, "Internal Server Error" + messageSuffix, errors, stack);
  }
}

export class BadRequest extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(400, "Bad Request" + messageSuffix, errors, stack);
  }
}

export class Unauthorized extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(401, "Unauthorized Access" + messageSuffix, errors, stack);
  }
}

export class Forbidden extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(403, "Forbidden Access" + messageSuffix, errors, stack);
  }
}

export class NotFound extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(404, "Resource Not Found" + messageSuffix, errors, stack);
  }
}

export class UnavailableLegally extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(500, "Unavailable For Legal Reasons" + messageSuffix, errors, stack);
  }
}

export class LoginTimeout extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(
      440,
      "Authentication Timed Out: Re-Login" + messageSuffix,
      errors,
      stack,
    );
  }
}

export class UnprocessableEntity extends ApiError {
  constructor(message?: string, errors?: SoftError[], stack?: any) {
    const messageSuffix = message ? ": " + message : "";
    super(422, "Unprocessable Entity" + messageSuffix, errors, stack);
  }
}
