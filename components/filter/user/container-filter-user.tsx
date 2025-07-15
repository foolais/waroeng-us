import { auth } from "@/auth";
import { FilterSearchUser } from "../filter-search";
import PopoverFilter from "../popover-filter";
import { FilterStoreCombobox } from "../store/filter-store";
import { FilterUserStatus } from "./filter-user";
import FilterUserButton from "./filter-user-button";
import DialogCreateUser from "@/components/dialog/create/dialog-create-user";

const ContainerFilterUser = async () => {
  const session = await auth();
  if (!session) return null;

  const role = session.user.role;

  return (
    <div className="container-filter">
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchUser
          placeholder="Cari pengguna disini..."
          className="w-[20vw]"
        />
        {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
        <FilterUserStatus />
        <FilterUserButton />
      </div>
      <div className="container-filter-title">
        {/* Mobile */}
        <div className="container-filter-mobile">
          <PopoverFilter>
            <h4>Filter Pengguna</h4>
            <FilterSearchUser
              placeholder="Cari pengguna disini..."
              className="w-full"
            />
            {role === "SUPER_ADMIN" && <FilterStoreCombobox />}
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
