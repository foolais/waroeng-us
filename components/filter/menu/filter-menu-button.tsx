/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  useSuperCategoryMenuFilter,
  useSuperMenuFilter,
} from "@/store/menu/useMenuFilter";
import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { SearchIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const FilterMenuButton = () => {
  const { filter: filterMenu } = useSuperMenuFilter();
  const { filter: filterStore } = useSuperUserFilter();
  const router = useRouter();
  const { data: session } = useSession();
  const isSuper = session?.user?.role === "SUPER_ADMIN";

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("search", filterMenu.search);
    params.set("status", filterMenu.status);
    if (isSuper) params.set("store", filterStore.store);

    if (filterMenu.search === "") params.delete("search");
    if (filterStore.store === "" && isSuper) params.delete("store");
    router.push(`${window.location.pathname}?${params}`);
  };

  useEffect(() => {
    return () => {
      const params = new URLSearchParams(window.location.search);
      params.delete("search");
      params.delete("status");
      if (isSuper) params.delete("store");
    };
  }, []);

  return (
    <Button className="w-full md:w-[100px] md:max-w-max" onClick={handleSearch}>
      Cari <SearchIcon />
    </Button>
  );
};

export const FilterCategoryMenuButton = () => {
  const { filter: filterMenu } = useSuperCategoryMenuFilter();
  const { filter: filterStore } = useSuperUserFilter();
  const router = useRouter();
  const { data: session } = useSession();
  const isSuper = session?.user?.role === "SUPER_ADMIN";

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("search", filterMenu.search);
    if (isSuper) params.set("store", filterStore.store);

    if (filterMenu.search === "") params.delete("search");
    if (filterStore.store === "" && isSuper) params.delete("store");
    router.push(`${window.location.pathname}?${params}`);
  };

  useEffect(() => {
    return () => {
      const params = new URLSearchParams(window.location.search);
      params.delete("search");
      if (isSuper) params.delete("store");
    };
  }, []);

  return (
    <Button className="w-full md:w-[100px] md:max-w-max" onClick={handleSearch}>
      Cari <SearchIcon />
    </Button>
  );
};
