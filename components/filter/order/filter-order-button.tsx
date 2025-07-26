"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useOrderFilter } from "@/store/order/useOrderFilter";
import { SearchIcon } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

const FilterOrderButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filter: filterOrder } = useOrderFilter();

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Update search and status params
    if (filterOrder.search) {
      params.set("search", filterOrder.search);
    } else {
      params.delete("search");
    }

    if (filterOrder.status && filterOrder.status !== "ALL") {
      params.set("status", filterOrder.status);
    } else {
      params.delete("status");
    }

    // Update date range params
    if (filterOrder.dateRange?.from) {
      params.set("dateFrom", formatDate(filterOrder.dateRange.from));
    } else {
      params.delete("dateFrom");
    }

    if (filterOrder.dateRange?.to) {
      params.set("dateTo", formatDate(filterOrder.dateRange.to));
    } else {
      params.delete("dateTo");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [filterOrder, pathname, router, searchParams]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const params = new URLSearchParams(window.location.search);
      params.delete("search");
      params.delete("status");
      params.delete("dateFrom");
      params.delete("dateTo");
    };
  }, []);

  return (
    <Button
      className="w-full md:w-[100px] md:max-w-max"
      onClick={handleSearch}
      aria-label="Search orders"
    >
      <span className="mr-2">Cari</span>
      <SearchIcon className="h-4 w-4" />
    </Button>
  );
};

export default FilterOrderButton;
