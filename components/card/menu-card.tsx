import { ICardMenu } from "@/types/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import LogoImage from "@/public/logo.png";
import { useCartStore } from "@/store/cart/useCartFilter";

const MenuCard = ({ data }: { data: ICardMenu }) => {
  const { items, updateQuantity, addItem } = useCartStore();
  const cartItem = items.find((item) => item.id === data.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (type: "ADD" | "MINUS") => {
    if (type === "ADD" && !cartItem) {
      addItem(data);
    } else {
      updateQuantity(data.id, type);
    }

    if (type === "MINUS" && quantity === 1) {
      toast.success(`${data.name} dihapus dari keranjang`, { duration: 1500 });
    } else {
      toast.success(
        type === "ADD"
          ? `Menambahkan ${data.name} ke keranjang`
          : `Mengurangi ${data.name} dari keranjang`,
        { duration: 1500 },
      );
    }
  };

  return (
    <Card className="gap-0 p-0">
      <CardHeader className="relative p-0">
        <Image
          src={data.image || LogoImage}
          alt={data.name}
          width={280}
          height={280}
          className="h-50 rounded-t-md object-cover"
          priority
        />
        <div
          className={`absolute right-5 bottom-5 z-10 flex items-center gap-2 transition-all duration-200 ease-in-out ${
            quantity > 0 ? "rounded-md bg-white" : ""
          }`}
        >
          <div
            className={`transition-all duration-200 ease-in-out ${
              quantity > 0
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-50 opacity-0"
            }`}
          >
            <Button
              onClick={() => handleAddToCart("MINUS")}
              disabled={quantity === 0}
              variant="outline"
              className="border-primary border-2"
            >
              <MinusIcon className="text-primary" />
            </Button>
          </div>
          <div
            className={`transition-all duration-200 ease-in-out ${
              quantity > 0
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-50 opacity-0"
            }`}
          >
            <Button variant="ghost">{quantity}</Button>
          </div>
          <Button
            onClick={() => handleAddToCart("ADD")}
            className="hover:opacity-100"
          >
            <PlusIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-center relative flex-col gap-2 px-4 pb-4">
        <h2 className="text-lg">{data.name}</h2>
        <span className="text-primary text-lg font-semibold">
          {formatPrice(+data.price)}
        </span>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
