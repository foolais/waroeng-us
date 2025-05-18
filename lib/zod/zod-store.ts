import { object, string } from "zod";

export const CreateStoreSchema = object({
  name: string()
    .min(5, "Store name must be more than 5 characters")
    .max(20, "Store name must be less than 20 characters"),
});
