"use client";

import {
  ChevronRight,
  Loader2,
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
import { useMemo, useState, useTransition } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart/useCartFilter";
import FormCart from "../form/cart/form-cart";
import { Separator } from "../ui/separator";
import { createOrder } from "@/lib/action/action-order";
import { toast } from "sonner";

const CartButton = () => {
  const { items, orderType, tableId, paymentType, notes, clearCart } =
    useCartStore();

  const [onFinishOrder, setOnFinishOrder] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalPrice = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );
  }, [items]);

  const handleFinishOrder = () => {
    if (items.length === 0)
      return toast.error("Keranjang masih kosong", { duration: 1500 });
    else if (totalPrice === 0)
      return toast.error("Total harga masih kosong", { duration: 1500 });
    else if (orderType === null)
      return toast.error("Tipe pesanan masih kosong", { duration: 1500 });
    else if (paymentType === null)
      return toast.error("Tipe pembayaran masih kosong", { duration: 1500 });

    startTransition(async () => {
      try {
        const payload = {
          orderType: orderType,
          tableId: tableId || null,
          paymentType: paymentType,
          notes: notes || null,
          totalPrice: totalPrice,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: +item.price,
          })),
        };
        const res = await createOrder(payload);
        if ("success" in res) {
          toast.success(res.message, { duration: 1500 });
          clearCart();
        } else toast.error(res.message as string, { duration: 1500 });
      } catch (error) {
        console.log(error);
      }
    });
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
              <Button
                type="submit"
                onClick={handleFinishOrder}
                disabled={isPending}
              >
                {isPending ? "Membuat Pesanan..." : "Buat Pesanan"}
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                <NotebookText />
              </Button>
              <Separator className="bg-primary my-1" />
              <Button
                type="submit"
                variant="outline"
                className="border-primary"
                disabled={isPending}
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
