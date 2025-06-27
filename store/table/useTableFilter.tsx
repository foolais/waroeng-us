import { TableStatus } from "@/types/types";
import { create } from "zustand";

interface SuperTableFilter {
  search: string;
  status: TableStatus | "ALL";
}

interface SuperTableStore {
  filter: SuperTableFilter;
  setFilter: (filter: Partial<SuperTableFilter>) => void;
}

export const useSuperTableFilter = create<SuperTableStore>((set) => ({
  filter: {
    search: "",
    status: "ALL",
  },
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
}));
