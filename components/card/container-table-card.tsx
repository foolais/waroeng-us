/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { tableStatusBadgeOptions } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ORDER_STATUS, TABLE_STATUS } from "@prisma/client";
import { FilterSearchTable } from "../filter/filter-search";
import { FilterTableStatus } from "../filter/table/filter-table";
import { useCallback, useMemo, useState } from "react";
import { useSuperTableFilter } from "@/store/table/useTableFilter";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import FormOrder from "../form/order/form-order";
import DialogForm from "../dialog/dialog-form";

interface TableTableProps {
  data: {
    no: number;
    id: string;
    name: string;
    status: TABLE_STATUS;
    store: {
      id: string;
      name: string;
    };
    orders: { id: string; status: ORDER_STATUS }[];
  }[];
}

const ContainerTableCard = ({ data }: TableTableProps) => {
  const { filter } = useSuperTableFilter();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [orderId, setOrderId] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesType =
        filter.status === "ALL" || item.status === filter.status;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [data, filter.status, filter.search]);

  const cardColor = (status: TABLE_STATUS) => {
    const table = tableStatusBadgeOptions.find(
      (option) => option.value === status,
    );
    if (!table) return "";

    const { bgColor, textColor } = table;
    return `${bgColor} ${textColor}`;
  };

  const handleClickCard = (tableId: string) => {
    const getTable = data.find((item) => item.id === tableId);
    if (!getTable)
      return toast.error("Meja tidak ditemukan", { duration: 1500 });

    const orderData = getTable.orders;
    if (orderData.length === 0 || getTable.status === "AVAILABLE")
      return toast.error("Meja tidak memiliki pesanan", { duration: 1500 });

    const selectedOrder = orderData.find((item) => item.status === "PENDING");

    setOrderId(selectedOrder?.id || "");
    setIsOpenForm(true);
  };

  const renderTableCard = useCallback(() => {
    return filteredData.map((table) => (
      <div
        key={table.id}
        onClick={() => handleClickCard(table.id)}
        className={cn(
          `text-md flex h-28 cursor-pointer flex-col items-center justify-center rounded-md border font-bold tracking-wider hover:text-xl hover:opacity-80 hover:shadow-lg md:text-xl md:hover:text-2xl`,
          cardColor(table.status),
        )}
      >
        <span>Meja {table.name}</span>
        <span className="text-xs md:text-sm">
          {
            tableStatusBadgeOptions.find(
              (option) => option.value === table.status,
            )?.label
          }
        </span>
      </div>
    ));
  }, [filteredData]);

  return (
    <div>
      <div className="flex w-full flex-col gap-4 py-4 sm:flex-row">
        <FilterSearchTable
          placeholder="Cari meja disini..."
          className="w-full sm:min-w-[50vw]"
        />
        <div className="w-full sm:w-[180px]">
          <FilterTableStatus isCashierPage />
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {renderTableCard()}
        {filteredData.length === 0 && (
          <div className="flex-center col-span-2 gap-2 pt-10 md:col-span-4">
            <TriangleAlert />
            <p className="">Menu Tidak Ditemukan</p>
          </div>
        )}
      </div>
      {isOpenForm && (
        <DialogForm
          isOpen={isOpenForm}
          onClose={() => setIsOpenForm(false)}
          title="Detail Pesanan"
          contentClassName="h-[90vh] md:h-[80vh] min-w-[90vw] overflow-y-auto flex flex-col"
        >
          <FormOrder
            orderId={orderId}
            type="UPDATE"
            onClose={() => setIsOpenForm(false)}
          />
        </DialogForm>
      )}
    </div>
  );
};

export default ContainerTableCard;
