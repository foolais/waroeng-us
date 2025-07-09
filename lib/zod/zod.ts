import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(3, "Password must be more than 3 characters")
    .max(20, "Password must be less than 20 characters"),
});

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
      .max(32, "Password must be less than 32 character")
      .optional(),
    confirmPassword: z
      .string()
      .min(3, "Password must be more than 3 character")
      .max(32, "Password must be less than 32 character")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const TableSchema = z.object({
  name: z
    .string()
    .min(2, "Table name must be more than 2 characters")
    .max(20, "Table name must be less than 20 characters"),
  status: z.enum(["AVAILABLE", "WAITING_ORDER", "DINING", "MAINTENANCE"]),
  storeId: z.string().nonempty("Store is required"),
});

export const MenuSchema = z.object({
  name: z
    .string()
    .min(2, "Menu name must be more than 2 characters")
    .max(20, "Menu name must be less than 20 characters"),
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
  price: z
    .string()
    .min(2, "Price must be more than 2 characters")
    .max(20, "Price must be less than 20 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"]),
  storeId: z.string().nonempty("Store is required"),
  categoryId: z.string().nonempty("Category is required"),
});

export const MenuCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Menu name must be more than 2 characters")
    .max(20, "Menu name must be less than 20 characters"),
  storeId: z.string().nonempty("Store is required"),
});
