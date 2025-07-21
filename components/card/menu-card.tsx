import { ICardMenu } from "@/types/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MenuCard = ({ data }: { data: ICardMenu }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = (type: "ADD" | "MINUS") => {
    if (quantity === 0 && type === "MINUS") return;

    const newQuantity = quantity + (type === "ADD" ? 1 : -1);
    setQuantity(newQuantity);

    const updatedItem = { ...data, quantity: newQuantity };

    try {
      const currentCartStr = localStorage.getItem("cart");
      let currentCart: ICardMenu[] = [];

      if (currentCartStr) {
        const parsed = JSON.parse(currentCartStr);
        currentCart = Array.isArray(parsed) ? parsed : [];
      }

      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === data.id,
      );

      if (newQuantity === 0) {
        currentCart = currentCart.filter((item) => item.id !== data.id);
      } else {
        if (existingItemIndex !== -1) {
          currentCart[existingItemIndex] = updatedItem;
        } else {
          currentCart.push(updatedItem);
        }
      }

      if (type === "ADD")
        toast.success(`Menambahkan ${data.name} ke keranjang`, {
          duration: 1500,
        });
      else
        toast.success(`Mengurangi ${data.name} dari keranjang`, {
          duration: 1500,
        });

      localStorage.setItem("cart", JSON.stringify(currentCart));
    } catch (error) {
      toast.error(`Error menambah ke keranjang ${error}`, { duration: 1500 });
      localStorage.setItem("cart", JSON.stringify([updatedItem]));
    }
  };

  return (
    <Card className="gap-0 p-0">
      <CardHeader className="relative p-0">
        <Image
          src={data.image}
          alt={data.name}
          width={280}
          height={280}
          className="h-50 rounded-t-md object-cover"
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
      <CardContent className="relative px-4">
        <h2 className="text-lg font-semibold">{data.name}</h2>
        <span className="text-primary text-lg font-semibold">
          {formatPrice(+data.price)}
        </span>
      </CardContent>
      <CardFooter className="grid justify-end pt-2 pb-4"></CardFooter>
    </Card>
  );
};

export default MenuCard;
