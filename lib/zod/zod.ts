import { z } from "zod";

export const StoreSchema = z.object({
  name: z
    .string()
    .min(5, "Store name must be more than 5 characters")
    .max(20, "Store name must be less than 20 characters"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const UserSchema = z
  .object({
    image: z.union([
      z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
          message: "Only image files are allowed",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Image must be less than 5MB",
        })
        .optional(),
      z.string().url().optional(),
    ]),
    name: z
      .string()
      .min(5, "Name must be more than 5 characters")
      .max(20, "Name must be less than 20 characters"),
    email: z
      .string()
      .min(2, "Email must be more than 1 character")
      .email("Invalid email"),
    gender: z.string().nonempty("Gender is required"),
    address: z
      .string()
      .min(2, "Address must be more than 1 character")
      .max(50, "Address must be less than 50 character")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .min(11, "Phone must be more than 11 character")
      .max(13, "Phone must be less than 13 character")
      .optional()
      .or(z.literal("")),
    role: z.enum(["ADMIN", "CASHIER"]),
    storeId: z.string().nonempty("Store is required"),
    password: z
      .string()
      .min(3, "Password must be more than 3 character")
      .max(32, "Password must be less than 32 character"),
    confirmPassword: z
      .string()
      .min(3, "Password must be more than 3 character")
      .max(32, "Password must be less than 32 character"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
