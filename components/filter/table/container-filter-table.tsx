import React from "react";
import { FilterSearchTable } from "../filter-search";
import { FilterTableStatus } from "./filter-table";
import FilterTableButton from "./filter-table-button";
import { FilterStoreCombobox } from "../store/filter-store";

const ContainerFilterTable = () => {
  return (
    <div className="container-filter">
      {/* Mobile */}
      <div className="container-filter-mobile">
        <FilterSearchTable placeholder="Cari disini..." className="w-full" />
        <div className="flex items-center justify-between gap-4">
          <FilterTableStatus />
          <FilterStoreCombobox />
          <FilterTableButton />
        </div>
      </div>
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchTable placeholder="Cari disini..." className="w-[20vw]" />
        <FilterTableStatus />
        <FilterStoreCombobox />
        <FilterTableButton />
      </div>
      {/* Create Btn */}
      <div className="container-title">
        <h1 className="header-title sm:hidden">Manajemen Meja</h1>
      </div>
    </div>
  );
};

export default ContainerFilterTable;
