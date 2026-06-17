import { queryClient } from "@utility/queryClient";
import * as authService from "./auth.service";
import type { ILoginRequest, ISignupRequest } from "./auth.types";

export const logoutMutation = async () => {
  const result = await authService.logout();
  await queryClient.clear(); // Clear cached data on logout
  return result;
};

export const signupMutation = async (payload: ISignupRequest) => {
  return await authService.signup(payload);
};

export const loginMutation = async (payload: ILoginRequest) => {
  return await authService.login(payload);
};
