"use client";

import { FormFieldCombobox } from "@/components/form/form-field";
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
import { useSuperStoreFilter } from "@/store/super/useStoreFilter";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllStore } from "@/lib/action/action-store";
import { toast } from "sonner";
import { useSuperUserFilter } from "@/store/user/useUserFilter";
import { debounce } from "lodash";

const statusOptions = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

export const FilterStoreStatusCombobox = () => {
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
          className="w-[48%] justify-between md:w-[100px]"
        >
          {filter.status
            ? statusOptions.find((data) => data.value === filter.status)?.label
            : "Select Status"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Cari Status..." className="h-9" />
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

interface iStoreData {
  value: string;
  label: string;
}

export const FilterStoreCombobox = () => {
  const { setFilter } = useSuperUserFilter();

  const [storeValue, setStoreValue] = useState("");
  const [storesData, setStoresData] = useState<iStoreData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized debounced fetch function
  const debouncedFetchTools = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          setIsSearching(true);
          const { data } = await getAllStore(
            1,
            encodeURIComponent(query),
            "ACTIVE",
          );

          const mappedData = Array.isArray(data)
            ? data.map((tool) => ({
                value: tool.id,
                label: tool.name,
              }))
            : [];

          setStoresData(mappedData);
        } catch (error) {
          console.error("Search error:", error);
          toast.error(
            `Failed to search tools: ${error instanceof Error ? error.message : String(error)}`,
          );
          setStoresData([]);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    [],
  );

  // Handle search query changes
  const handleSearch = (query: string) => {
    if (query.trim()) {
      debouncedFetchTools(query);
    }
  };

  // Initial data load
  useEffect(() => {
    debouncedFetchTools("");
  }, [debouncedFetchTools]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchTools.cancel();
    };
  }, [debouncedFetchTools]);

  return (
    <FormFieldCombobox
      name="store"
      label="Store"
      isHiddenLabel
      placeholder="Filter Store"
      widthClassName="w-full md:w-[175px]"
      isLoadingQuery={isSearching}
      data={storesData}
      value={storeValue}
      setValue={setStoreValue}
      isQuerySearch
      onSearch={handleSearch}
      onChangeForm={(val) => setFilter({ store: val })}
    />
  );
};
