import DialogCreateStore from "@/components/dialog/super/dialog-create-store";
import { FilterStoreStatusCombobox } from "./filter-store";
import FilterStoreButton from "./filter-store-button";
import { FilterSearchStore } from "../filter-search";

const ContainerFilterStore = () => {
  return (
    <div className="container-filter">
      {/* Mobile */}
      <div className="container-filter-mobile">
        <FilterSearchStore placeholder="Search Store Here" className="w-full" />
        <div className="flex items-center justify-between">
          <FilterStoreStatusCombobox />
          <FilterStoreButton />
        </div>
      </div>
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchStore
          placeholder="Search Store Here"
          className="w-[40vw]"
        />
        <FilterStoreStatusCombobox />
        <FilterStoreButton />
      </div>
      {/* Create Btn */}
      <div className="container-title">
        <h1 className="header-title sm:hidden">Store Management</h1>
        <DialogCreateStore />
      </div>
    </div>
  );
};

export default ContainerFilterStore;
