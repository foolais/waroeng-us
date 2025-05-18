import React from "react";
import FilterSearch from "../filter-search";
import { FilterSuperStoreStatus } from "./filter-super-combobox";
import { FilterSuperStoreButton } from "./filter-super-button";
import DialogCreateStore from "@/components/dialog/dialog-create-store";

const FilterSuperStore = () => {
  return (
    <div className="my-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
      {/* Mobile */}
      <div className="order-2 flex w-full flex-col items-stretch gap-2 sm:hidden">
        <FilterSearch placeholder="Search Store Here" className="w-full" />
        <div className="flex items-center justify-between">
          <FilterSuperStoreStatus />
          <FilterSuperStoreButton />
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden items-center gap-2 sm:order-1 sm:flex">
        <FilterSearch placeholder="Search Store Here" />
        <FilterSuperStoreStatus />
        <FilterSuperStoreButton />
      </div>
      <div className="order-1 flex w-full items-center justify-between sm:order-2 sm:w-auto">
        <h1 className="header-title sm:hidden">Store Management</h1>
        <DialogCreateStore />
      </div>
    </div>
  );
};

export default FilterSuperStore;
