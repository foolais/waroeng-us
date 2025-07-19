"use client";

import { useCashierFilterMenu } from "@/store/menu/useMenuFilter";
import { useEffect, useState } from "react";

const ContainerCardMenu = () => {
  const { filter } = useCashierFilterMenu();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(filter.search);
  }, [filter]);
  return <div>{search}</div>;
};

export default ContainerCardMenu;
