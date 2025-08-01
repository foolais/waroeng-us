"use client";

import { getAllCategory } from "@/lib/action/action-category";
import CategoryCard from "./category-card";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const ScrollButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) => (
  <Button
    size="icon"
    onClick={onClick}
    className="absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 text-black shadow-md hover:bg-white"
    style={{
      [direction === "left" ? "left" : "right"]: "0.5rem",
    }}
  >
    {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
  </Button>
);

const ContainerCategoryCard = () => {
  const { data: session } = useSession();
  const store = session?.user?.storeId;

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isFetching, startFetching] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!store) return;
    startFetching(async () => {
      const { data } = await getAllCategory(1, "", store);
      const mappedData =
        data && data.length > 0
          ? data.map((item) => ({ id: item.id, name: item.name }))
          : [];
      setCategories(mappedData);
    });
  }, [store]);

  const scroll = (direction: "left" | "right") => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const hasCategories = categories.length > 0;

  return (
    <div className="relative w-full py-4 md:w-[80vw]">
      {/* Scroll Button */}
      {hasCategories && (
        <ScrollButton direction="left" onClick={() => scroll("left")} />
      )}

      {/* Main container with proper width */}
      <div className="mx-auto w-full overflow-hidden px-8">
        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex w-full gap-3 overflow-x-auto scroll-smooth px-4"
        >
          {isFetching && <Skeleton className="h-10 w-full" />}

          {!isFetching &&
            categories.map((category) => (
              <CategoryCard key={category.id} name={category.name} />
            ))}
        </div>
      </div>

      {/* Scroll Button */}
      {hasCategories && (
        <ScrollButton direction="right" onClick={() => scroll("right")} />
      )}
    </div>
  );
};

export default ContainerCategoryCard;
