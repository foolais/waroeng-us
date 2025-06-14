"use client";

import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { FormFieldInput } from "../form/form-field";
import { useSuperStoreFilter } from "@/store/super/useStoreFilter";

export const FilterSearchStore = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) => {
  const { filter, setFilter } = useSuperStoreFilter();

  return (
    <FormFieldInput
      name="search"
      placeholder={placeholder}
      value={filter.search}
      onChange={(e) => setFilter({ search: e.target.value })}
      className={className}
    />
  );
};

export const FilterSearchUser = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) => {
  const { filter, setFilter } = useSuperUserFilter();

  return (
    <FormFieldInput
      name="search"
      placeholder={placeholder}
      value={filter.search}
      onChange={(e) => setFilter({ search: e.target.value })}
      className={className}
    />
  );
};
