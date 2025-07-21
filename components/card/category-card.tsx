"use client";

import { useCashierFilterMenu } from "@/store/menu/useMenuFilter";
import { Button } from "../ui/button";
import { useCallback } from "react";

const CategoryCard = ({ name }: { name: string }) => {
  const { filter, setFilter } = useCashierFilterMenu();

  const isActive = filter.type === name;

  const handleClick = useCallback(() => {
    setFilter({ type: isActive ? "" : name });
  }, [isActive, name, setFilter]);

  return (
    <Button
      size="sm"
      variant={isActive ? "default" : "outline"}
      onClick={handleClick}
    >
      {name}
    </Button>
  );
};

export default CategoryCard;
