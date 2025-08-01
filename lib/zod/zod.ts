import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(3, "Password harus lebih dari 3 karakter")
    .max(20, "Password harus kurang dari 20 karakter"),
});

export const StoreSchema = z.object({
  name: z
    .string()
    .min(5, "Nama toko harus lebih dari 5 karakter")
    .max(20, "Nama toko harus kurang dari 20 karakter"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const UserSchema = z
  .object({
    image: z.union([
      z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
          message: "Hanya file gambar yang diizinkan",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Gambar harus kurang dari 5MB",
        }),
      z.string().url(),
      z.literal(""),
    ]),
    name: z
      .string()
      .min(3, "Nama harus lebih dari 3 karakter")
      .max(20, "Nama harus kurang dari 20 karakter"),
    email: z
      .string()
      .min(2, "Email harus lebih dari 2 karakter")
      .email("Email tidak valid"),
    gender: z.string().nonempty("Jenis kelamin tidak boleh kosong"),
    address: z
      .string()
      .min(2, "Alamat harus lebih dari 2 karakter")
      .max(50, "Alamat harus kurang dari 50 karakter")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .min(11, "Telepon harus lebih dari 11 karakter")
      .max(13, "Telepon harus kurang dari 13 karakter")
      .optional()
      .or(z.literal("")),
    role: z.enum(["ADMIN", "CASHIER"]),
    storeId: z.string().nonempty("Toko tidak boleh kosong"),
    password: z
      .string()
      .min(3, "Password harus lebih dari 3 karakter")
      .max(32, "Password harus kurang dari 32 karakter")
      .optional(),
    confirmPassword: z
      .string()
      .min(3, "Password harus lebih dari 3 karakter")
      .max(32, "Password harus kurang dari 32 karakter")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export const TableSchema = z.object({
  name: z
    .string()
    .min(2, "Meja harus lebih dari 2 karakter")
    .max(5, "Meja harus kurang dari 5 karakter"),
  status: z.enum(["AVAILABLE", "WAITING_ORDER", "DINING", "MAINTENANCE"]),
  storeId: z.string().nonempty("Toko tidak boleh kosong"),
});

export const MenuSchema = z.object({
  name: z
    .string()
    .min(2, "Nama menu harus lebih dari 2 karakter")
    .max(20, "Nama menu harus kurang dari 30 karakter"),
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
          message: "Hanya file gambar yang diizinkan",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Gambar harus kurang dari 5MB",
        }),
      z.string().url(),
      z.literal(""),
    ])
    .optional(),
  price: z.string().min(1, "Harga tidak bole negatif"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"]),
  storeId: z.string().nonempty("Toko tidak boleh kosong"),
  categoryId: z.string().nonempty("Kategori tidak boleh kosong"),
});

export const MenuCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nama menu harus lebih dari 2 karakter")
    .max(20, "Nama menu harus kurang dari 30 karakter"),
  storeId: z.string().nonempty("Toko tidak boleh kosong"),
});

export const orderSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELED"]),
  type: z.enum(["TAKE_AWAY", "DINE_IN"]),
  total: z.number(),
  tableId: z.string().optional().or(z.literal("")),
  orderItem: z.array(
    z.object({
      menuId: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  orderNumber: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  transaction: z.object({
    method: z.enum(["CASH", "QR"]),
  }),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty("Password lama tidak boleh kosong"),
    newPassword: z
      .string()
      .min(3, "Password baru harus lebih dari 3 karakter")
      .max(32, "Password baru harus kurang dari 32 karakter"),
    confirmPassword: z
      .string()
      .min(3, "Password harus lebih dari 3 karakter")
      .max(32, "Password harus kurang dari 32 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Password baru tidak boleh sama dengan password lama",
    path: ["newPassword"],
  });
