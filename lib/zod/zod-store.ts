import { object, string } from "zod";

export const StoreSchema = object({
  name: string()
    .min(5, "Store name must be more than 5 characters")
    .max(20, "Store name must be less than 20 characters"),
  status: string().nonempty("Status is required"),
});
