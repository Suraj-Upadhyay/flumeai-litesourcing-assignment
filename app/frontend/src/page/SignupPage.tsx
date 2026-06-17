import { Link, useNavigate } from "@tanstack/react-router";
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
import { useSignup } from "@/domains/auth/auth.query";
import type { ISignupRequest } from "@/domains/auth/auth.types";

export function SignupPage() {
  const navigate = useNavigate();
  const { mutate: signupMutation, isPending, isError } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupRequest>();

  const onSubmit = (data: ISignupRequest) => {
    signupMutation(data, {
      onSuccess: () => {
        // Once signed up, direct them to login
        navigate({ to: "/login" });
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
            Create an Account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Sign up to get started with LiteSourcing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {isError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                Registration failed. Please try a different username.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="name@company.com"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <span className="text-xs text-red-500">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters",
                  },
                })}
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
              {isPending ? "Creating account..." : "Sign up"}
            </Button>

            {/* Link back to login */}
            <div className="text-center text-sm text-slate-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
