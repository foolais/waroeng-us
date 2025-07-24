import { ICardMenu } from "@/types/types";
import LogoImage from "@/public/logo.png";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart/useCartFilter";

const CartMenuCard = ({ data }: { data: ICardMenu }) => {
  const { items, updateQuantity, addItem, removeItem } = useCartStore();
  const [showDelete, setShowDelete] = useState(false);

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

  const handleRemoveItem = () => {
    removeItem(data.id);
    setShowDelete(false);
    toast.success(`${data.name} dihapus dari keranjang`, { duration: 1500 });
  };

  return (
    <div className="relative flex items-center justify-between overflow-hidden">
      <div
        className={`flex w-full items-center justify-between pl-4 transition-all duration-300 ${
          showDelete ? "bg-slate-100" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <Image
            src={data.image || LogoImage}
            alt={data.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
            priority
          />
          <div className="">
            <h2 className="truncate text-sm md:text-lg">{data.name}</h2>
            <span className="text-primary text-sm font-semibold md:text-lg">
              {formatPrice(+data.price)}
            </span>
          </div>
        </div>
        {/* Button Add Minus */}
        <div className="flex items-center gap-1 pr-6">
          <div
            className={`transition-all duration-200 ${
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
              size="sm"
            >
              <MinusIcon className="text-primary" size={16} />
            </Button>
          </div>
          <div
            className={`transition-all duration-200 ${
              quantity > 0
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-50 opacity-0"
            }`}
          >
            <Button variant="ghost" size="sm">
              {quantity}
            </Button>
          </div>
          <Button
            onClick={() => handleAddToCart("ADD")}
            className="hover:opacity-100"
            size="sm"
          >
            <PlusIcon size={16} />
          </Button>
        </div>
      </div>
      {/* Delete */}
      <div
        className={`bg-destructive absolute top-0 right-0 flex h-full items-center justify-end gap-2 rounded-l-md transition-all duration-300 ${
          showDelete ? "w-44 px-4" : "w-0 overflow-hidden"
        }`}
      >
        <Button
          variant="outline"
          className={`bg-destructive hover:text-destructive border-2 border-white text-white hover:bg-white ${
            showDelete
              ? "opacity-100 transition-opacity delay-300"
              : "opacity-0"
          }`}
          onClick={handleRemoveItem}
          size="sm"
        >
          <Trash2 size={18} className="mr-1" />
          Hapus
        </Button>

        <Button
          variant="ghost"
          className={`text-destructive hover:text-destructive bg-white hover:bg-slate-100 ${
            showDelete
              ? "opacity-100 transition-opacity delay-300"
              : "opacity-0"
          }`}
          onClick={() => setShowDelete(false)}
          size="sm"
        >
          <X size={18} />
        </Button>
      </div>
      <div
        className={`bg-destructive absolute top-0 right-0 h-full w-4 cursor-pointer rounded-l-md transition-all duration-300 ${
          showDelete ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => setShowDelete(true)}
      />
    </div>
  );
};

export default CartMenuCard;
