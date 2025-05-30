"use client";

import { FormFieldInput } from "../form/form-field";
import { useSuperStoreFilter } from "@/store/super/useStoreFilter";

const FilterSearch = ({
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

export default FilterSearch;
