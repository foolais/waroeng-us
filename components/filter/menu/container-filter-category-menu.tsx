import React from "react";
import { FilterSearchCategoryMenu } from "../filter-search";
import { FilterStoreCombobox } from "../store/filter-store";
import PopoverFilter from "../popover-filter";
import { FilterCategoryMenuButton } from "./filter-menu-button";

const ContainerFilterCategoryMenu = () => {
  return (
    <div className="container-filter">
      <div className="container-filter-desktop">
        <FilterSearchCategoryMenu
          placeholder="Cari kategori disini..."
          className="w-[20vw]"
        />
        <FilterStoreCombobox />
        <FilterCategoryMenuButton />
      </div>
      <div className="container-filter-title">
        <div className="container-filter-mobile">
          <h1 className="header-title md:hidden">Manajemen Kategori</h1>
          <PopoverFilter>
            <h4>Filter Kategori</h4>
            <FilterSearchCategoryMenu
              placeholder="Cari kategori disini..."
              className="w-full"
            />
            <FilterStoreCombobox />
            <FilterCategoryMenuButton />
          </PopoverFilter>
        </div>
        {/* Dialog Create Menu */}
      </div>
    </div>
  );
};

export default ContainerFilterCategoryMenu;
