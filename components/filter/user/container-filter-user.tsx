import { FilterSearchUser } from "../filter-search";
import { FilterStoreCombobox } from "../store/filter-store";
import { FilterUserStatus } from "./filter-user";
import FilterUserButton from "./filter-user-button";
import DialogCreateUser from "@/components/dialog/user/dialog-create-user";

const ContainerFilterUser = () => {
  return (
    <div className="container-filter">
      {/* Mobile */}
      <div className="container-filter-mobile">
        <FilterSearchUser placeholder="Search Here" className="w-full" />
        <div className="flex items-center justify-between gap-2">
          <FilterStoreCombobox />
          <FilterUserStatus />
          <FilterUserButton />
        </div>
      </div>
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchUser placeholder="Search Here" className="w-[20vw]" />
        <FilterStoreCombobox />
        <FilterUserStatus />
        <FilterUserButton />
      </div>
      {/* Create Btn */}
      <div className="container-title">
        <h1 className="header-title sm:hidden">User Management</h1>
        {/* Dialog Create */}
        <DialogCreateUser />
      </div>
    </div>
  );
};

export default ContainerFilterUser;
