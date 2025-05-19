import { create } from "zustand";

interface SuperUserFilter {
  search: string;
  store: string;
  role: "ALL" | "ADMIN" | "CASHIER";
}

interface SuperUserStore {
  filter: SuperUserFilter;
  setFilter: (filter: Partial<SuperUserFilter>) => void;
}

export const useSuperUserFilter = create<SuperUserStore>((set) => ({
  filter: {
    search: "",
    store: "",
    role: "ALL",
  },
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
}));

interface UserImageStore {
  url: string;
  setUrl: (url: string) => void;
}

export const useUserImage = create<UserImageStore>((set) => ({
  url: "",
  setUrl: (url) => set(() => ({ url })),
}));
