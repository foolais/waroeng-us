import DialogCreateStore from "@/components/dialog/create/dialog-create-store";
import { FilterStoreStatusCombobox } from "./filter-store";
import FilterStoreButton from "./filter-store-button";
import { FilterSearchStore } from "../filter-search";
import PopoverFilter from "../popover-filter";

const ContainerFilterStore = () => {
  return (
    <div className="container-filter">
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchStore
          placeholder="Cari Toko disini..."
          className="w-[40vw]"
        />
        <FilterStoreStatusCombobox />
        <FilterStoreButton />
      </div>

      <div className="container-filter-title">
        {/* Mobile */}
        <div className="container-filter-mobile">
          <PopoverFilter>
            <h4>Filter Toko</h4>
            <FilterSearchStore
              placeholder="Cari Toko disini..."
              className="w-full"
            />
            <FilterStoreStatusCombobox />
            <FilterStoreButton />
          </PopoverFilter>
        </div>
        {/* Create Btn */}
        <DialogCreateStore />
      </div>
    </div>
  );
};

export default ContainerFilterStore;
