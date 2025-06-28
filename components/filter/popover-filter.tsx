"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Funnel } from "lucide-react";

const PopoverFilter = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-primary" aria-expanded={open} aria-label="Filter">
          Filter
          <Funnel />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-70vw flex flex-col gap-4">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverFilter;
