import { ORDER_STATUS } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

interface OrderFilter {
  search: string;
  status: "ALL" | ORDER_STATUS;
  dateRange?: DateRange;
}

interface OrderStore {
  filter: OrderFilter;
  setFilter: (filter: Partial<OrderFilter>) => void;
  clearDateRange: () => void;
}

export const useOrderFilter = create<OrderStore>((set) => ({
  filter: {
    search: "",
    status: "ALL",
  },
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  clearDateRange: () =>
    set((state) => ({ filter: { ...state.filter, dateRange: undefined } })),
}));
