import { ICardMenu, MenuStatus } from "@/types/types";
import { persist } from "zustand/middleware";
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

// search menu on cashier page
interface CashierFilterMenu {
  search: string;
  type: string;
}

interface CashierMenuStore {
  filter: CashierFilterMenu;
  setFilter: (filter: Partial<CashierFilterMenu>) => void;
}

export const useCashierFilterMenu = create<CashierMenuStore>((set) => ({
  filter: {
    search: "",
    type: "",
  },
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
}));

interface CartState {
  items: ICardMenu[];
  addItem: (item: ICardMenu) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, type: "ADD" | "MINUS") => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, type) => {
        const currentItems = [...get().items]; // Clone array
        const itemIndex = currentItems.findIndex((item) => item.id === id);

        if (itemIndex >= 0) {
          const newQuantity =
            (currentItems[itemIndex].quantity || 0) + (type === "ADD" ? 1 : -1);

          if (newQuantity <= 0) {
            currentItems.splice(itemIndex, 1);
          } else {
            currentItems[itemIndex] = {
              ...currentItems[itemIndex],
              quantity: newQuantity,
            };
          }

          set({ items: currentItems });
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
