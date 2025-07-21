"use client";

import { ShoppingBasket, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ICardMenu } from "@/types/types";
import CartMenuCard from "../card/cart-menu-card";
import { useCartStore } from "@/store/menu/useMenuFilter";

const CartButton = () => {
  const { items } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <span className="hidden md:block">Keranjang Pesanan</span>
          <ShoppingBasket className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby="cart">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Keranjang Pesanan <ShoppingBasket />
          </SheetTitle>
        </SheetHeader>
        <div>
          {items && items.length > 0 ? (
            items.map((item: ICardMenu) => (
              <CartMenuCard key={item.id} data={item} />
            ))
          ) : (
            <div className="flex items-center justify-center gap-2">
              <TriangleAlert />
              <p className="">Masukkan Pesanan Terlebih Dahulu</p>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button type="submit">Buat Pesanan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;
