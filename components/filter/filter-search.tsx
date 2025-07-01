"use client";

import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { FormFieldInput } from "../form/form-field";
import { useSuperStoreFilter } from "@/store/super/useStoreFilter";
import { useEffect } from "react";
import { useSuperTableFilter } from "@/store/table/useTableFilter";
import {
  useSuperCategoryMenuFilter,
  useSuperMenuFilter,
} from "@/store/menu/useMenuFilter";

export const FilterSearchStore = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) => {
  const { filter, setFilter } = useSuperStoreFilter();

  useEffect(() => {
    setFilter({ search: "" });
  }, [setFilter]);

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

export const FilterSearchTable = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) => {
  const { filter, setFilter } = useSuperTableFilter();

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

export const FilterSearchMenu = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) => {
  const { filter, setFilter } = useSuperMenuFilter();

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

export const FilterSearchCategoryMenu = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) => {
  const { filter, setFilter } = useSuperCategoryMenuFilter();

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
