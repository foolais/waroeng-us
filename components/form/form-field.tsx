import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CommandLoading } from "cmdk";

interface iFormFieldInputProps<T>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string[];
  value: string;
  setFormValues?: React.Dispatch<React.SetStateAction<T>>;
}

export const FormFieldInput = <T,>({
  name,
  label,
  error,
  value,
  setFormValues,
  ...rest
}: iFormFieldInputProps<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues?.((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const errorMessage = useMemo(() => error?.[0], [error]);

  return (
    <div className={cn("flex flex-col", label && "space-y-1.5")}>
      <Label htmlFor={name as string}>{label}</Label>
      <Input
        id={name as string}
        name={name as string}
        value={value}
        onChange={handleChange}
        {...rest}
      />
      {errorMessage && (
        <div aria-live="polite" aria-atomic="true" className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

type SelectData = {
  value: string;
  label: string;
};

interface ComboboxProps {
  name: string;
  label: string;
  placeholder: string;
  widthClassName?: string;
  data: SelectData[];
  value: string;
  setValue: (value: string) => void;
  onChangeForm: (value: string) => void;
  onSearch?: (value: string) => void;
  isQuerySearch?: boolean;
  isLoadingQuery?: boolean;
  isDisabled?: boolean;
  error?: string[];
  isHiddenLabel?: boolean;
}

export const FormFieldCombobox = ({
  name,
  label,
  placeholder,
  widthClassName,
  data,
  value,
  setValue,
  onChangeForm,
  onSearch = () => {},
  isQuerySearch = false,
  isLoadingQuery = false,
  isDisabled = false,
  isHiddenLabel = false,
  error,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectedItem = data.find((item) => item.value === value);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (isQuerySearch) {
      onSearch(value);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5",
        widthClassName ? widthClassName : "w-full",
      )}
    >
      {!isHiddenLabel && <Label>{label}</Label>}
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between",
              widthClassName ? widthClassName : "w-full",
            )}
            disabled={isLoadingQuery || isDisabled}
          >
            {selectedItem ? (
              selectedItem?.label
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-0", widthClassName ? widthClassName : "w-[375px]")}
        >
          <Command shouldFilter={!isQuerySearch}>
            {isQuerySearch ? (
              <CommandInput
                placeholder={`Cari ${label.toLowerCase()}...`}
                className="h-9"
                value={inputValue}
                onValueChange={handleInputChange}
              />
            ) : (
              <CommandInput
                placeholder={`Cari ${label.toLowerCase()}...`}
                className="h-9"
              />
            )}
            <CommandList>
              {isLoadingQuery ? (
                <CommandLoading className="flex-center py-6 text-center text-sm">
                  Loading...
                </CommandLoading>
              ) : (
                <>
                  <CommandEmpty>
                    {label.charAt(0).toUpperCase() + label.slice(1)} tidak
                    ditemukan.
                  </CommandEmpty>
                  {data.find((item) => item.value === value) && (
                    <CommandItem
                      id={name as string}
                      value={value}
                      onSelect={(currentValue) => {
                        const newValue =
                          currentValue === value ? "" : currentValue;
                        setValue(newValue);
                        onChangeForm(newValue);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {selectedItem?.label}
                      <Check className="ml-auto opacity-100" />
                    </CommandItem>
                  )}
                  {data
                    .filter((item) => item.value != value)
                    .map((item) => (
                      <CommandItem
                        id={name as string}
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === value ? "" : currentValue;
                          setValue(newValue);
                          onChangeForm(newValue);
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        {item.label}
                        <Check className="ml-auto opacity-0" />
                      </CommandItem>
                    ))}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <div aria-live="polite" aria-atomic="true">
          <span className="error-message">{error.join(" & ")}</span>
        </div>
      )}
    </div>
  );
};
