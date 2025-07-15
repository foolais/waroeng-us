"use client";

import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { getAllStore } from "@/lib/action/action-store";
import {
  createTable,
  getTableById,
  updateTable,
} from "@/lib/action/action-table";
import { tableStatusOptions } from "@/lib/data";
import { getButtonText } from "@/lib/utils";
import { TableSchema } from "@/lib/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FormTableProps {
  tableId?: string;
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

const FormTable = ({ tableId, type, onClose }: FormTableProps) => {
  const form = useForm<z.infer<typeof TableSchema>>({
    resolver: zodResolver(TableSchema),
    defaultValues: {
      name: "",
      status: "AVAILABLE",
      storeId: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);
  const [storesData, setStoresData] = useState<
    { value: string; label: string }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [isFetching, startFetching] = useTransition();

  // Memoized debounced fetch function
  const debouncedFetchStores = useMemo(
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
            ? data.map((store) => ({ value: store.id, label: store.name }))
            : [];
          setStoresData(mappedData);
        } catch (error) {
          console.error("Search error:", error);
          toast.error(
            `Failed to search stores: ${error instanceof Error ? error.message : String(error)}`,
          );
          setStoresData([]);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    [],
  );

  // Handle search query changes
  const handleSearch = useCallback(
    (query: string) => {
      debouncedFetchStores(query.trim());
    },
    [debouncedFetchStores],
  );

  // Initial store data load
  useEffect(() => {
    debouncedFetchStores("");
    return () => debouncedFetchStores.cancel();
  }, [debouncedFetchStores]);

  const handleSubmit = (values: z.infer<typeof TableSchema>) => {
    startTransition(async () => {
      try {
        const payload = { ...values, storeId: values.storeId as string };

        if (type === "CREATE") {
          const res = await createTable(payload);
          if (res.success) toast.success(res.message, { duration: 1500 });
        } else if (type === "UPDATE" && tableId) {
          const res = await updateTable(tableId, payload);
          if (res.success) toast.success(res.message, { duration: 1500 });
        }
        onClose();
        form.reset();
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    if (!tableId || type === "CREATE") return;
    startFetching(async () => {
      try {
        const data = await getTableById(tableId);
        if (data && !("error" in data)) {
          form.reset({
            name: data.name,
            status: data.status,
            storeId: data.storeId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [form, tableId, type]);

  const formDisabled = isFetching || isPending || type === "DETAIL";

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    disabled={formDisabled}
                    placeholder="Masukan Nama"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store</FormLabel>
                <FormControl>
                  <Combobox
                    options={storesData}
                    value={field.value}
                    onChange={field.onChange}
                    onSearch={handleSearch}
                    isLoading={isSearching}
                    placeholder="Pilih Toko"
                    disabled={formDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue="AVAILABLE"
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className="w-full cursor-pointer"
                      disabled={formDisabled}
                    >
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tableStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {type !== "DETAIL" && (
            <Button type="submit" className="ml-auto flex" disabled={isPending}>
              {getButtonText(type, "Meja", isPending)}
              {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

export default FormTable;
