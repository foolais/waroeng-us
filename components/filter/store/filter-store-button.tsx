"use client";

import { Button } from "@/components/ui/button";
import { useSuperStoreFilter } from "@/store/super/useStoreFilter";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  useEffect(() => {
    return () => {
      const params = new URLSearchParams(window.location.search);
      params.delete("search");
      params.delete("status");
    };
  }, []);

  return (
    <Button className="w-full md:w-[100px]" onClick={handleSearch}>
      Cari <SearchIcon />
    </Button>
  );
};

export default FilterStoreButton;
