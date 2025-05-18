"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSuperStoreFilter } from "@/store/super/useSuperFilter";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const statusOptions = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

export const FilterSuperStoreStatus = () => {
  const { filter, setFilter } = useSuperStoreFilter();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select status"
          aria-expanded={open}
          className="w-[100px] justify-between"
        >
          {filter.status
            ? statusOptions.find((data) => data.value === filter.status)?.label
            : "Select Status"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." className="h-9" />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            {statusOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  setFilter({
                    status:
                      currentValue === filter.status
                        ? "ALL"
                        : (currentValue as "ALL" | "ACTIVE" | "INACTIVE"),
                  });
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                {option.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    filter.status === option.value
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
