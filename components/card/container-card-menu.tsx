"use client";

import { getAllMenu } from "@/lib/action/action-menu";
import { useCashierFilterMenu } from "@/store/menu/useMenuFilter";
import { ICardMenu } from "@/types/types";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import MenuCard from "./menu-card";

const ContainerCardMenu = () => {
  const { data: session } = useSession();
  const store = session?.user?.storeId;

  const { filter } = useCashierFilterMenu();
  const [search, setSearch] = useState("");
  const [menuData, setMenuData] = useState<ICardMenu[]>([]);
  const [isFetching, startFetching] = useTransition();

  useEffect(() => {
    setSearch(filter.search);
  }, [filter]);

  useEffect(() => {
    if (!store) return;
    startFetching(async () => {
      const { data } = await getAllMenu(1, search, "ALL", store);
      const mappedData =
        data && data.length > 0
          ? data.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price.toString(),
              image: item.image ?? "",
              status: item.status,
            }))
          : [];

      setMenuData(mappedData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  return (
    <div className="grid w-full grid-cols-4 gap-4">
      {!isFetching &&
        menuData.map((menu) => <MenuCard key={menu.id} data={menu} />)}
    </div>
  );
};

export default ContainerCardMenu;
