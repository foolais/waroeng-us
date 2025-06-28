"use client";

import { Button } from "@/components/ui/button";
import { useSuperTableFilter } from "@/store/table/useTableFilter";
import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FilterTableButton = () => {
  const { filter: filterTable } = useSuperTableFilter();
  const { filter: filterStore } = useSuperUserFilter();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("search", filterTable.search);
    params.set("status", filterTable.status);
    params.set("store", filterStore.store);
    if (filterTable.search === "") params.delete("search");
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
    <Button className="w-[48%] max-w-max sm:w-[100px]" onClick={handleSearch}>
      Cari <SearchIcon />
    </Button>
  );
};

export default FilterTableButton;
