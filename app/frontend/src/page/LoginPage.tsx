import { Button } from "@packages/ui/components/ui/button";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@packages/ui/components/ui/card";
import { useForm } from "react-hook-form";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import type { ILoginRequest } from "@/domains/auth/auth.types";
import { useLogin } from "@/domains/auth/auth.query";
import { useAuth } from "@/context/AuthContext";

const routeApi = getRouteApi("/login");

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login: setAuthContext } = useAuth();
  const { mutate: loginMutation, isPending, isError } = useLogin();
  const search = routeApi.useSearch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>();

  const onSubmit = (data: ILoginRequest) => {
    loginMutation(data, {
      onSuccess: () => {
        setAuthContext("mock-jwt-token");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigate({ to: (search as any)?.redirect || "/projects" });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-xl shadow-sm">
              🏢
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to LiteSourcing
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {isError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                Invalid username or password. Please try again.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                {...register("username", { required: "username is required" })}
              />
              {errors.username && (
                <span className="text-xs text-red-500">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm text-slate-600 mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
