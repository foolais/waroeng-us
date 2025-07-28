"use client";

import { FormFieldCombobox } from "@/components/form/form-field";
import { useSuperTableFilter } from "@/store/table/useTableFilter";
import { TableStatus } from "@/types/types";
import { useState } from "react";

const statusOptions = [
  { value: "ALL", label: "Semua" },
  { value: "AVAILABLE", label: "Tersedia" },
  { value: "WAITING_ORDER", label: "Menunggu Pesanan" },
  { value: "DINING", label: "Sedang Makan" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

export const FilterTableStatus = ({
  isCashierPage = false,
}: {
  isCashierPage?: boolean;
}) => {
  const { setFilter } = useSuperTableFilter();
  const [statusValue, setStatusValue] = useState("ALL");

  return (
    <FormFieldCombobox
      name="status"
      label="Status"
      isHiddenLabel
      placeholder="Filter Status"
      widthClassName="w-full md:w-[180px]"
      data={isCashierPage ? statusOptions.slice(0, 4) : statusOptions}
      value={statusValue}
      setValue={(val) => setStatusValue(val as "ALL" | TableStatus)}
      onChangeForm={(val) => {
        const status = val === "" ? "ALL" : val;
        setFilter({ status: status as "ALL" | TableStatus });
      }}
    />
  );
};
