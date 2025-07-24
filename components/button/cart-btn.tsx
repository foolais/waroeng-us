"use client";

import {
  ChevronRight,
  NotebookText,
  ShoppingBasket,
  Trash,
  TriangleAlert,
  Undo,
} from "lucide-react";
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
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart/useCartFilter";
import FormCart from "../form/cart/form-cart";
import { Separator } from "../ui/separator";

const CartButton = () => {
  const { items, orderType, tableId, paymentType, clearCart } = useCartStore();

  const [onFinishOrder, setOnFinishOrder] = useState(false);

  const totalPrice = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );
  }, [items]);

  const createOrder = () => {
    const payload = {
      orderType: orderType,
      tableId: tableId || null,
      paymentType: paymentType,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: +item.price,
      })),
    };
    console.log({ payload });
  };

  const emptyOrder = () => {
    clearCart();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <span className="hidden md:block">Keranjang Pesanan</span>
          <ShoppingBasket className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby="cart" className="gap-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Keranjang Pesanan <ShoppingBasket />
          </SheetTitle>
        </SheetHeader>
        {onFinishOrder ? (
          <FormCart totalPrice={totalPrice} />
        ) : (
          <>
            <div className="no-scrollbar grid h-full max-h-[80%] flex-1 auto-rows-min gap-4 overflow-y-auto py-2">
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
            <div className="flex justify-between px-4">
              <span className="text-lg font-semibold">Total Harga:</span>
              <span className="text-lg font-semibold">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </>
        )}

        <SheetFooter>
          {!onFinishOrder ? (
            <>
              <Button
                type="submit"
                variant="outline"
                className="border-primary"
                onClick={() => setOnFinishOrder(true)}
                disabled={items.length === 0}
              >
                Selanjutnya
                <ChevronRight />
              </Button>
              <Separator className="bg-primary my-1" />
              <Button
                type="submit"
                variant="destructive"
                onClick={emptyOrder}
                disabled={items.length === 0}
              >
                Kosongkan Pesanan
                <Trash />
              </Button>
            </>
          ) : (
            <>
              <Button type="submit" onClick={createOrder}>
                Buat Pesanan
                <NotebookText />
              </Button>
              <Separator className="bg-primary my-1" />
              <Button
                type="submit"
                variant="outline"
                className="border-primary"
                onClick={() => {
                  setOnFinishOrder(false);
                }}
              >
                Kembali
                <Undo />
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;
