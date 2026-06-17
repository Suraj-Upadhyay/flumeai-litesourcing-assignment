export type IApiResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  errors: null | string[];
  data: T;
};
