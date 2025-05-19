import React from "react";
import FilterSearch from "../filter-search";
import { FilterStoreCombobox } from "../store/filter-store";
import { FilterUserStatus } from "./filter-user";
import FilterUserButton from "./filter-user-button";
import DialogCreateUser from "@/components/dialog/user/dialog-create-user";

const ContainerFilterUser = () => {
  return (
    <div className="my-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
      {/* Mobile */}
      <div className="order-2 flex w-full flex-col items-stretch gap-2 sm:hidden">
        <FilterSearch placeholder="Search Here" className="w-full" />
        <div className="flex items-center justify-between gap-2">
          <FilterStoreCombobox />
          <FilterUserStatus />
          <FilterUserButton />
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden items-center gap-2 sm:order-1 sm:flex">
        <FilterSearch placeholder="Search Here" className="w-[20vw]" />
        <FilterStoreCombobox />
        <FilterUserStatus />
        <FilterUserButton />
      </div>
      {/* Create Btn */}
      <div className="order-1 flex w-full items-center justify-between sm:order-2 sm:w-auto">
        <h1 className="header-title sm:hidden">User Management</h1>
        {/* Dialog Create */}
        <DialogCreateUser />
      </div>
    </div>
  );
};

export default ContainerFilterUser;
