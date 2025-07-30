import { ORDER_STATUS, ORDER_TYPE } from "@prisma/client";

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
  type: string;
  status: "AVAILABLE" | "UNAVAILABLE";
  quantity: number;
}

export type orderType = "DINE_IN" | "TAKE_AWAY";

export type paymentType = "CASH" | "QR";

export interface TableOrderProps {
  no: number;
  id: string;
  orderNumber: string;
  status: ORDER_STATUS;
  type: ORDER_TYPE;
  table: {
    name: string;
  } | null;
  total: number;
  transaction: {
    method: "CASH" | "QR";
  } | null;
}

export type TimeRange = "today" | "3days" | "7days" | "15days" | "1month";
