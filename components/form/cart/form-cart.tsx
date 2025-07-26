/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Combobox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllTable } from "@/lib/action/action-table";
import { orderTypeOptions, paymentTypeOptions } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart/useCartFilter";
import { orderType, paymentType } from "@/types/types";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const FormCart = ({ totalPrice }: { totalPrice: number }) => {
  const {
    orderType,
    tableId,
    paymentType,
    notes,
    setOrderType,
    setTableId,
    setPaymentType,
    setNotes,
  } = useCartStore();
  const { data: session, status } = useSession();

  const [tableData, setTableData] = useState<
    { value: string; label: string }[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);

  const storeId = session?.user.storeId;

  const fetchTables = useMemo(
    () =>
      debounce(async (query: string = "") => {
        if (!storeId) return;

        try {
          setIsFetching(true);
          const { data } = await getAllTable(1, query, "AVAILABLE", storeId);
          const mappedData = Array.isArray(data)
            ? data.map((table) => ({ value: table.id, label: table.name }))
            : [];
          setTableData(mappedData);
        } catch (error) {
          console.log(error);
          toast.error(
            `Failed to search stores: ${error instanceof Error ? error.message : String(error)}`,
          );
          setTableData([]);
        } finally {
          setIsFetching(false);
        }
      }),
    [storeId],
  );

  const debouncedFetchTables = useMemo(
    () => debounce(fetchTables, 300),
    [storeId],
  );

  const handleSearchTable = useCallback(
    (query: string) => {
      debouncedFetchTables(query.trim());
    },
    [debouncedFetchTables],
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchTables();
    }
  }, [status, storeId]);

  useEffect(() => {
    return () => {
      debouncedFetchTables.cancel();
    };
  }, [debouncedFetchTables]);

  return (
    <div className="w-full space-y-4 px-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="orderType" className="required">
          Tipe Pesanan
        </Label>
        <Select
          value={orderType}
          onValueChange={(value) => setOrderType(value as orderType)}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Pilih Tipe Order" />
          </SelectTrigger>
          <SelectContent>
            {orderTypeOptions.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="cursor-pointer"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {orderType === "DINE_IN" && (
        <div className="flex flex-col gap-2">
          <Label>Meja</Label>
          <Combobox
            disabled={isFetching}
            options={tableData}
            placeholder="Pilih Meja"
            value={tableId || ""}
            onChange={setTableId}
            onSearch={handleSearchTable}
            isLoading={isFetching}
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="orderType" className="required">
          Tipe Pembayaran
        </Label>
        <Select
          value={paymentType}
          onValueChange={(value) => setPaymentType(value as paymentType)}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Pilih Tipe Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            {paymentTypeOptions.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="cursor-pointer"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Total Harga</Label>
        <Input
          placeholder="Total Harga"
          value={formatPrice(totalPrice)}
          disabled
          readOnly
          style={{ opacity: 100 }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Catatan</Label>
        <Textarea
          placeholder="Masukkan catatan disini..."
          value={notes || ""}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FormCart;
