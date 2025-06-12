import { z } from "zod";

export const StoreSchema = z.object({
  name: z
    .string()
    .min(5, "Store name must be more than 5 characters")
    .max(20, "Store name must be less than 20 characters"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
