import React from "react";
import { FilterSearchCategoryMenu } from "../filter-search";
import { FilterStoreCombobox } from "../store/filter-store";
import PopoverFilter from "../popover-filter";
import { FilterCategoryMenuButton } from "./filter-menu-button";
import DialogCreateMenuCategory from "@/components/dialog/create/dialog-create-menu-category";
import { auth } from "@/auth";

const ContainerFilterCategoryMenu = async () => {
  const session = await auth();
  if (!session) return null;

  const role = session.user.role;

  return (
    <div className="container-filter">
      <div className="container-filter-desktop">
        <FilterSearchCategoryMenu
          placeholder="Cari kategori disini..."
          className="w-[20vw]"
        />
        {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
        <FilterCategoryMenuButton />
      </div>
      <div className="container-filter-title">
        <div className="container-filter-mobile">
          <PopoverFilter>
            <h4>Filter Kategori</h4>
            <FilterSearchCategoryMenu
              placeholder="Cari kategori disini..."
              className="w-full"
            />
            {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
            <FilterCategoryMenuButton />
          </PopoverFilter>
        </div>
        {/* Dialog Create Menu */}
        <DialogCreateMenuCategory />
      </div>
    </div>
  );
};

export default ContainerFilterCategoryMenu;
