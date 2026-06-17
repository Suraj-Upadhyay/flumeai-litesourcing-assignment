import axios, { type AxiosRequestConfig } from "axios";
import type { IApiResponse } from "../types/apiresponse.type";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL + "/api/v1";

const axiosAPICall = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const serverMessage =
      error.response?.data?.message || error.response?.data?.error;

    if (serverMessage) return serverMessage;
    switch (error.response?.status) {
      case 401:
        return "Session expired. Please login again.";
      case 403:
        return "You don't have permission to do this.";
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "Internal server error. Please try again later.";
      default:
        return error.message || "An unexpected network error occurred.";
    }
  }
  return "An unknown error occurred.";
};

axiosAPICall.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleAxiosError(error);
    console.error(`[API Error]: ${errorMessage}`);
    return Promise.reject(error);
  }
);

/**
 * 4. The Exported Wrapper
 * We use 'axiosAPICall' internally to avoid infinite recursion.
 * This ensures every call returns the unwrapped IApiResponse<T> directly.
 */
export const axiosInstance = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosAPICall.get<IApiResponse<T>>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosAPICall
      .post<IApiResponse<T>>(url, data, config)
      .then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosAPICall
      .patch<IApiResponse<T>>(url, data, config)
      .then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosAPICall
      .put<IApiResponse<T>>(url, data, config)
      .then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosAPICall.delete<IApiResponse<T>>(url, config).then((res) => res.data),
};
