"use client";

import { Button } from "@/components/ui/button";
import { useSuperStoreFilter } from "@/store/super/useStoreFilter";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const FilterStoreButton = () => {
  const { filter } = useSuperStoreFilter();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("search", filter.search);
    params.set("status", filter.status);
    if (filter.search === "") params.delete("search");
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <Button className="w-[48%] sm:w-[100px]" onClick={handleSearch}>
      Search <SearchIcon />
    </Button>
  );
};

export default FilterStoreButton;
