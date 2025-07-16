import { FilterSearchTable } from "../filter-search";
import { FilterTableStatus } from "./filter-table";
import FilterTableButton from "./filter-table-button";
import { FilterStoreCombobox } from "../store/filter-store";
import DialogCreateTable from "@/components/dialog/create/dialog-create-table";
import PopoverFilter from "../popover-filter";
import { auth } from "@/auth";

const ContainerFilterTable = async () => {
  const session = await auth();
  if (!session) return null;

  const role = session.user.role;

  return (
    <div className="container-filter">
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchTable placeholder="Cari disini..." className="w-[20vw]" />
        <FilterTableStatus />
        {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
        <FilterTableButton />
      </div>
      {/* Create Btn */}
      <div className="container-filter-title">
        {/* Mobile */}
        <div className="container-filter-mobile">
          <PopoverFilter>
            <h4>Filter Meja</h4>
            <FilterSearchTable
              placeholder="Cari disini..."
              className="w-full"
            />
            <FilterTableStatus />
            {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
            <FilterTableButton />
          </PopoverFilter>
        </div>
        <DialogCreateTable />
      </div>
    </div>
  );
};

export default ContainerFilterTable;
