import { object, string } from "zod";

export const RegisterSchema = object({
  name: string()
    .min(3, "Username must be more than 3 characters")
    .max(20, "Username must be less than 20 characters"),
  email: string().email("Invalid email"),
  password: string()
    .min(3, "Password must be more than 3 characters")
    .max(20, "Password must be less than 20 characters"),
  confirmPassword: string()
    .min(3, "Password must be more than 3 characters")
    .max(20, "Password must be less than 20 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const LoginSchema = object({
  email: string().email("Invalid email"),
  password: string()
    .min(3, "Password must be more than 3 characters")
    .max(20, "Password must be less than 20 characters"),
});
