"use client";

import { FormFieldCombobox } from "@/components/form/form-field";
import { menuStatusOption } from "@/lib/data";
import { useSuperMenuFilter } from "@/store/menu/useMenuFilter";
import { MenuStatus } from "@/types/types";
import { useState } from "react";

export const FilterMenuStatus = () => {
  const { setFilter } = useSuperMenuFilter();
  const [statusValue, setStatusValue] = useState("ALL");

  return (
    <FormFieldCombobox
      name="status"
      label="Status"
      isHiddenLabel
      placeholder="Filter Status"
      widthClassName="w-full md:w-[180px]"
      data={[{ value: "ALL", label: "Semua" }, ...menuStatusOption]}
      value={statusValue}
      setValue={(val) => setStatusValue(val as "ALL" | MenuStatus)}
      onChangeForm={(val) => {
        const status = val === "" ? "ALL" : val;
        setFilter({ status: status as "ALL" | MenuStatus });
      }}
    />
  );
};
