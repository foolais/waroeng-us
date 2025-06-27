export type TableStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "WAITING_ORDER"
  | "DINING"
  | "MAINTENANCE";

export interface iFormStore {
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface iFromUser {
  image?: string;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  address?: string;
  phone?: string;
  role: "ADMIN" | "CASHIER";
  storeId: string;
  password: string;
  confirmPassword: string;
}
