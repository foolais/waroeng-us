export type TableStatus =
  | "AVAILABLE"
  | "WAITING_ORDER"
  | "DINING"
  | "MAINTENANCE";

export type MenuStatus = "AVAILABLE" | "UNAVAILABLE";

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

export interface ICardMenu {
  id: string;
  name: string;
  price: string;
  image: string;
  status: "AVAILABLE" | "UNAVAILABLE";
}
