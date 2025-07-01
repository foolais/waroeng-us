"use client";

import { Button } from "@/components/ui/button";
import { useSuperMenuFilter } from "@/store/menu/useMenuFilter";
import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FilterMenuButton = () => {
  const { filter: filterMenu } = useSuperMenuFilter();
  const { filter: filterStore } = useSuperUserFilter();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("search", filterMenu.search);
    params.set("status", filterMenu.status);
    params.set("store", filterStore.store);
    if (filterMenu.search === "") params.delete("search");
    if (filterStore.store === "") params.delete("store");
    router.push(`${window.location.pathname}?${params}`);
  };

  useEffect(() => {
    return () => {
      const params = new URLSearchParams(window.location.search);
      params.delete("search");
      params.delete("status");
      params.delete("store");
    };
  }, []);

  return (
    <Button className="w-full md:w-[100px] md:max-w-max" onClick={handleSearch}>
      Cari <SearchIcon />
    </Button>
  );
};

export default FilterMenuButton;
