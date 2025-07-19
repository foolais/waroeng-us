"use client";

import { Input } from "@/components/ui/input";
import { useCashierFilterMenu } from "@/store/menu/useMenuFilter";
import { SearchIcon } from "lucide-react";

const FilterSearchMenu = () => {
  const { filter, setFilter } = useCashierFilterMenu();

  return (
    <div className="relative">
      <Input
        name="search"
        placeholder="Cari menu disini..."
        value={filter.search}
        onChange={(e) => setFilter({ search: e.target.value })}
      />
      <div className="absolute top-1/2 right-3 -translate-y-1/2">
        <SearchIcon className="size-5" />
      </div>
    </div>
  );
};

export default FilterSearchMenu;
