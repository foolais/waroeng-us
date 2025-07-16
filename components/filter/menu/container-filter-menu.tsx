import DialogCreateMenu from "@/components/dialog/create/dialog-create-menu";
import { FilterSearchMenu } from "../filter-search";
import PopoverFilter from "../popover-filter";
import { FilterStoreCombobox } from "../store/filter-store";
import { FilterMenuStatus } from "./filter-menu";
import { FilterMenuButton } from "./filter-menu-button";
import { auth } from "@/auth";

const ContainerFilterMenu = async () => {
  const session = await auth();
  if (!session) return null;

  const role = session.user.role;

  return (
    <div className="container-filter">
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchMenu
          placeholder="Cari Menu disini..."
          className="w-[20vw]"
        />
        <FilterMenuStatus />
        {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
        <FilterMenuButton />
      </div>
      <div className="container-filter-title">
        <div className="container-filter-mobile">
          <PopoverFilter>
            <h4>Filter Meja</h4>
            <FilterSearchMenu
              placeholder="Cari Menu disini..."
              className="w-full"
            />
            <FilterMenuStatus />
            {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
            <FilterMenuButton />
          </PopoverFilter>
        </div>
        <DialogCreateMenu />
      </div>
    </div>
  );
};

export default ContainerFilterMenu;
