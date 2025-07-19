"use client";

import { Button } from "../ui/button";

const CategoryCard = ({ name }: { name: string }) => {
  return <Button size="sm">{name}</Button>;
};

export default CategoryCard;
