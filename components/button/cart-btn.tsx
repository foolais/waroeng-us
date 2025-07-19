import { ShoppingBasket } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const CartButton = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <span className="hidden md:block">Keranjang Pesanan</span>
          <ShoppingBasket className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Keranjang Pesanan <ShoppingBasket />
          </SheetTitle>
        </SheetHeader>
        <div className="py-2"></div>
        <SheetFooter>
          <Button type="submit">Buat Pesanan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;
