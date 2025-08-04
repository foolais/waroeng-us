import React from "react";
import { FormInputSkeleton, FormTextAreaSkeleton } from "../form-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const FormOrderSkeleton = ({
  type,
}: {
  type: "CREATE" | "UPDATE" | "DETAIL";
}) => {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
      <div className="w-full space-y-4 py-3.5 md:w-2/5">
        <FormInputSkeleton /> {/* No Pesanan */}
        <FormInputSkeleton /> {/* No Status */}
        <FormInputSkeleton /> {/* Tipe Pesanan */}
        <FormInputSkeleton /> {/* Tipe Pesanan */}
        <FormInputSkeleton /> {/* Meja */}
        <FormInputSkeleton /> {/* Metode Pembayaran */}
        <FormTextAreaSkeleton /> {/* Catatan */}
        <FormInputSkeleton /> {/* Total Harga */}
        <FormInputSkeleton /> {/* Total Pembayaran */}
        <FormInputSkeleton /> {/* Total Kembalian */}
      </div>
      <div className="w-full md:w-3/5">
        <div className="mb-4 flex flex-col gap-4">
          {type === "UPDATE" && (
            <>
              {/* Detail Pesanan */}
              <Skeleton className="h-6 w-full" />
            </>
          )}
          {/* Button Tambahkan Pesanan Baru */}
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-16 w-16" /> {/* Image */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-full" /> {/* Nama */}
                <Skeleton className="h-10 w-full" /> {/* Jumlah */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormOrderSkeleton;
