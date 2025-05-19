import { object, string, z } from "zod";

export const UserSchema = object({
  image: z
    .instanceof(File)
    .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .optional(),
  name: string()
    .min(5, "Name must be more than 5 characters")
    .max(20, "Name must be less than 20 characters"),
  email: string()
    .min(2, "Email must be more than 1 character")
    .email("Invalid email"),
  gender: string().nonempty("Gender is required"),
  address: string()
    .min(2, "Address must be more than 1 character")
    .max(50, "Address must be less than 50 character")
    .optional()
    .or(z.literal("")),
  phone: string()
    .min(11, "Phone must be more than 11 character")
    .max(13, "Phone must be less than 13 character")
    .optional()
    .or(z.literal("")),
  role: string().nonempty("Role is required"),
  storeId: string().nonempty("Store is required"),
  password: string()
    .min(3, "Password must be more than 3 character")
    .max(32, "Password must be less than 32 character"),
  confirmPassword: string()
    .min(3, "Password must be more than 3 character")
    .max(32, "Password must be less than 32 character"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password don't match",
  path: ["confirmPassword"],
});
