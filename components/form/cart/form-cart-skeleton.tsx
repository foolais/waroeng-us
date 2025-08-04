import { useCartStore } from "@/store/cart/useCartFilter";
import { FormInputSkeleton, FormTextAreaSkeleton } from "../form-skeleton";

const FormCartSkeleton = () => {
  const { orderType } = useCartStore();
  return (
    <div className="grid w-full items-center gap-4 px-4">
      <FormInputSkeleton /> {/* Tipe Pesanan */}
      {orderType === "DINE_IN" && <FormInputSkeleton />} {/* Meja */}
      <FormInputSkeleton /> {/* Tipe Pembayaran */}
      <FormTextAreaSkeleton /> {/* Catatan */}
      <FormInputSkeleton /> {/* Total Harga */}
      <FormInputSkeleton /> {/* Total Pembayaran */}
      <FormInputSkeleton /> {/* Total Kembalian */}
    </div>
  );
};

export default FormCartSkeleton;
