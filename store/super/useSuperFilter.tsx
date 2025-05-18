import { create } from "zustand";

interface SuperStoreFilter {
  search: string;
  status: "ALL" | "ACTIVE" | "INACTIVE";
}

interface SuperStoreStore {
  filter: SuperStoreFilter;
  setFilter: (filter: Partial<SuperStoreFilter>) => void;
}

export const useSuperStoreFilter = create<SuperStoreStore>((set) => ({
  filter: {
    search: "",
    status: "ALL",
  },
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
}));
