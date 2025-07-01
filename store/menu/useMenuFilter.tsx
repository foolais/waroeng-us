import { MenuStatus } from "@/types/types";
import { create } from "zustand";

interface SuperMenuFilter {
  search: string;
  status: MenuStatus | "ALL";
}

interface SuperMenuStore {
  filter: SuperMenuFilter;
  setFilter: (filter: Partial<SuperMenuFilter>) => void;
}

export const useSuperMenuFilter = create<SuperMenuStore>((set) => ({
  filter: {
    search: "",
    status: "ALL",
  },
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
}));
