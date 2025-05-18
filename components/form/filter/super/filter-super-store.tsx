import React from "react";
import FilterSearch from "../filter-search";
import { FilterSuperStoreStatus } from "./filter-super-combobox";
import { FilterSuperStoreButton } from "./filter-super-button";

const FilterSuperStore = () => {
  return (
    <div className="my-4 flex items-center gap-2">
      <FilterSearch placeholder="Search Store Here" />
      <FilterSuperStoreStatus />
      <FilterSuperStoreButton />
    </div>
  );
};

export default FilterSuperStore;
