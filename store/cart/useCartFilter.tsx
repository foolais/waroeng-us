import { ICardMenu, orderType } from "@/types/types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface CartState {
  items: ICardMenu[];
  orderType: orderType;
  tableId: string | null;
  setOrderType: (type: orderType) => void;
  setTableId: (id: string | null) => void;
  addItem: (item: ICardMenu) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, type: "ADD" | "MINUS") => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: "DINE_IN",
      tableId: null,
      setOrderType: (type: orderType) => {
        set({ orderType: type });

        if (type === "TAKE_AWAY") set({ tableId: null });
      },
      setTableId: (id: string | null) => set({ tableId: id }),
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
      clearCart: () => set({ items: [], orderType: "DINE_IN", tableId: null }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
