"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Combobox = ({
  options,
  value,
  onChange,
  onSearch,
  isLoading = false,
  placeholder = "Select...",
  className,
  disabled = false,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={isLoading || disabled}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command shouldFilter={!onSearch} className="w-full">
          {onSearch && (
            <CommandInput
              placeholder="Cari..."
              value={searchQuery}
              onValueChange={(query) => {
                setSearchQuery(query);
                onSearch(query);
              }}
            />
          )}
          {!isLoading && <CommandEmpty>No results found.</CommandEmpty>}
          <CommandGroup>
            {isLoading ? (
              <div className="flex-center py-6">
                <p className="text-sm">Loading</p>
                <Loader2 className="ml-2 size-4 animate-spin" />
              </div>
            ) : (
              options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
