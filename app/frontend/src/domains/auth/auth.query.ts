import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "./auth.service";
import type { ILoginRequest, ISignupRequest } from "./auth.types";

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear(); // Clear cached data on logout
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (payload: ISignupRequest) => authService.signup(payload),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: ILoginRequest) => authService.login(payload),
  });
};
