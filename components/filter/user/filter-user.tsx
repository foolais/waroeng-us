"use client";

import { FormFieldCombobox } from "@/components/form/form-field";
import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { useState } from "react";

const roleOptions = [
  { value: "ALL", label: "All" },
  { value: "ADMIN", label: "Admin" },
  { value: "CASHIER", label: "Cashier" },
];

export const FilterUserStatus = () => {
  const { setFilter } = useSuperUserFilter();
  const [roleValue, setRoleValue] = useState("ALL");

  return (
    <FormFieldCombobox
      name="role"
      label="Role"
      isHiddenLabel
      placeholder="Filter Role"
      widthClassName="w-[120px]"
      data={roleOptions}
      value={roleValue}
      setValue={(val) => setRoleValue(val as "ALL" | "ADMIN" | "CASHIER")}
      onChangeForm={(val) => {
        const role = val === "" ? "ALL" : val;
        setFilter({ role: role as "ALL" | "ADMIN" | "CASHIER" });
      }}
    />
  );
};
