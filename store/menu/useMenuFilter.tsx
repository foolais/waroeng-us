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

// Category

interface SuperCategoryMenuFilter {
  search: string;
}

interface SuperCategoryMenuStore {
  filter: SuperCategoryMenuFilter;
  setFilter: (filter: Partial<SuperCategoryMenuFilter>) => void;
}

export const useSuperCategoryMenuFilter = create<SuperCategoryMenuStore>(
  (set) => ({
    filter: {
      search: "",
    },
    setFilter: (filter) =>
      set((state) => ({ filter: { ...state.filter, ...filter } })),
  }),
);

interface menuImageStore {
  url: string;
  setUrl: (url: string) => void;
}

export const useMenuImage = create<menuImageStore>((set) => ({
  url: "",
  setUrl: (url) => set(() => ({ url })),
}));
