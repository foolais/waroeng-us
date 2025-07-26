"use client";

import { FormFieldCombobox } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { orderStatusOptions } from "@/lib/data";
import { useOrderFilter } from "@/store/order/useOrderFilter";
import { ORDER_STATUS } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export const FilterOrderStatus = () => {
  const { setFilter } = useOrderFilter();
  const [statusValue, setStatusValue] = useState("ALL");

  return (
    <FormFieldCombobox
      name="status"
      label="Status"
      isHiddenLabel
      placeholder="Filter Status"
      widthClassName="w-full md:w-[200px]"
      data={[{ value: "ALL", label: "Semua" }, ...orderStatusOptions]}
      value={statusValue}
      setValue={(val) => setStatusValue(val as "ALL" | ORDER_STATUS)}
      onChangeForm={(val) => {
        const status = val === "" ? "ALL" : val;
        setFilter({ status: status as "ALL" | ORDER_STATUS });
      }}
    />
  );
};

interface FilterOrderDateProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const FilterOrderDate = ({
  value,
  onChange,
  placeholder = "Pilih rentang tanggal",
  className = "",
}: FilterOrderDateProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(value);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (onChange) {
      onChange(range);
    }
  };

  const displayText = () => {
    if (!dateRange?.from) return placeholder;
    if (dateRange.from && !dateRange.to)
      return moment(dateRange.from).format("L");
    if (dateRange.from && dateRange.to) {
      return `${moment(dateRange.from).format("L")} - ${moment(dateRange.to).format("L")}`;
    }
    return placeholder;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!dateRange?.from}
          className={`data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal ${className} w-[220px]`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleDateChange}
          initialFocus
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          numberOfMonths={2}
          defaultMonth={dateRange?.from}
        />
      </PopoverContent>
    </Popover>
  );
};

export const ContainerFilterOrderDate = () => {
  const { filter, setFilter } = useOrderFilter();

  return (
    <FilterOrderDate
      value={filter.dateRange}
      onChange={(range) => setFilter({ dateRange: range })}
    />
  );
};
