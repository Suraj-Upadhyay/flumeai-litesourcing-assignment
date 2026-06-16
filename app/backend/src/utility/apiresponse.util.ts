import type { SoftError } from "./error.util";

export class ApiResponse {
  status: number;
  data: object | null;
  message: string;
  success: boolean;
  errors?: SoftError[] | undefined;

  constructor(
    status: number,
    data: object | null,
    message = "Success",
    errors?: [],
  ) {
    this.status = status;
    this.success = status < 400;
    this.message = message;
    this.errors = errors;
    this.data = data;
  }

  toJSON() {
    const errors = this.errors
      ? this.errors.map((error): object => {
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
