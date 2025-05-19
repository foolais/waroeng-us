"use client";

import { Button } from "@/components/ui/button";
import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const FilterUserButton = () => {
  const { filter } = useSuperUserFilter();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("search", filter.search);
    params.set("store", filter.store);
    params.set("role", filter.role);
    if (filter.search === "") params.delete("search");
    if (filter.store === "") params.delete("store");
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <Button className="w-[30%] sm:w-[100px]" onClick={handleSearch}>
      <span>Search </span>
      <SearchIcon />
    </Button>
  );
};

export default FilterUserButton;
