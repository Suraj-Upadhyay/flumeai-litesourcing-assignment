import { password } from "bun";
import z from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^*()_\-+={}\[\]|:;<>,.?]).*$/;

export type ISignupRequest = {
  username: string;
  password: string;
  confirm_password: string;
};

const usernameSchema = z
  .string()
  .min(6, "username must be at least 6 characters long")
  .regex(/^[a-zA-Z0-9-]+$/, {
    message: "Invalid characters detected",
  });

const passwordSchema = z
  .string()
  .min(6, "passwrod must be at least 6 characters long")
  .max(20, "password too long")
  .regex(passwordRegex, {
    message:
      "Password must contain an uppercase letter, lowercase letter, number, and special character",
  });

export const SignupSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ILoginRequest = {
  username: string;
  password: string;
};

export const LoginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
