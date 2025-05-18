import React from "react";
import FilterSearch from "../filter-search";
import { FilterSuperStoreStatus } from "./filter-super-combobox";
import { FilterSuperStoreButton } from "./filter-super-button";
import DialogCreateStore from "@/components/dialog/dialog-create-store";

const FilterSuperStore = () => {
  return (
    <div className="my-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FilterSearch placeholder="Search Store Here" />
        <FilterSuperStoreStatus />
        <FilterSuperStoreButton />
      </div>
      <DialogCreateStore />
    </div>
  );
};

export default FilterSuperStore;
