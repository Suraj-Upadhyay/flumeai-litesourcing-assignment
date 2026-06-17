import { axiosInstance } from "@utility/api";
import type { ILoginRequest, ISignupRequest } from "./auth.types";

export const logout = async () => {
  const response = await axiosInstance.get<null>("/auth/logout");
  return response.data;
};

export const signup = async (payload: ISignupRequest) => {
  const response = await axiosInstance.post<null>("/auth/signup", payload);
  return response.data;
};

export const login = async (payload: ILoginRequest) => {
  const response = await axiosInstance.post<null>("/auth/login", payload);
  return response.data;
};
