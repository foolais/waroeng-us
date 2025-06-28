import { FilterSearchUser } from "../filter-search";
import PopoverFilter from "../popover-filter";
import { FilterStoreCombobox } from "../store/filter-store";
import { FilterUserStatus } from "./filter-user";
import FilterUserButton from "./filter-user-button";
import DialogCreateUser from "@/components/dialog/user/dialog-create-user";

const ContainerFilterUser = () => {
  return (
    <div className="container-filter">
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchUser placeholder="Search Here" className="w-[20vw]" />
        <FilterStoreCombobox />
        <FilterUserStatus />
        <FilterUserButton />
      </div>
      <div className="container-filter-title">
        {/* Mobile */}
        <div className="container-filter-mobile">
          <h1 className="header-title md:hidden">Manajemen Pengguna</h1>
          <PopoverFilter>
            <h4>Filter Pengguna</h4>
            <FilterSearchUser placeholder="Search Here" className="w-full" />
            <FilterStoreCombobox />
            <FilterUserStatus />
            <FilterUserButton />
          </PopoverFilter>
        </div>

        {/* Create Btn */}
        <DialogCreateUser />
      </div>
    </div>
  );
};

export default ContainerFilterUser;
