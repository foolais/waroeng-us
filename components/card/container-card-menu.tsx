"use client";

import { getAllMenu } from "@/lib/action/action-menu";
import { useCashierFilterMenu } from "@/store/menu/useMenuFilter";
import { ICardMenu } from "@/types/types";
import { useSession } from "next-auth/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import MenuCard from "./menu-card";
import { TriangleAlert } from "lucide-react";

const ContainerCardMenu = () => {
  const { data: session, status } = useSession();
  const store = session?.user?.storeId;

  const { filter } = useCashierFilterMenu();
  const [menuData, setMenuData] = useState<ICardMenu[]>([]);
  const [isFetching, startFetching] = useTransition();

  useEffect(() => {
    if (!store || status !== "authenticated") return;
    startFetching(async () => {
      const { data } = await getAllMenu(1, "", "ALL", store);
      const mappedData =
        data && data.length > 0
          ? data.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price.toString(),
              image: item.image ?? "",
              status: item.status,
              type: item.category.name,
              quantity: 0,
            }))
          : [];

      setMenuData(mappedData);
    });
  }, [store, status]);

  const filteredData = useMemo(() => {
    return menuData.filter((item) => {
      const matchesType = filter.type === "" || item.type === filter.type;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [menuData, filter.type, filter.search]);

  const renderMenuCards = useCallback(() => {
    return filteredData.map((menu) => <MenuCard key={menu.id} data={menu} />);
  }, [filteredData]);

  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {!isFetching && renderMenuCards()}
      {filteredData.length === 0 && !isFetching && (
        <div className="flex-center col-span-2 gap-2 pt-10 md:col-span-4">
          <TriangleAlert />
          <p className="">Menu Tidak Ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default ContainerCardMenu;
