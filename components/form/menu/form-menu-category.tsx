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
  createCategory,
  getCategoryById,
  updateCategory,
} from "@/lib/action/action-category";
import { getAllStore, getStoreById } from "@/lib/action/action-store";
import { getButtonText } from "@/lib/utils";
import { MenuCategorySchema } from "@/lib/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
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

interface iProps {
  categoryId?: string;
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

const FormMenuCategory = ({ categoryId, type, onClose }: iProps) => {
  const form = useForm<z.infer<typeof MenuCategorySchema>>({
    resolver: zodResolver(MenuCategorySchema),
    defaultValues: {
      name: "",
      storeId: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);
  const [storesData, setStoresData] = useState<
    { value: string; label: string }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [isFetching, startFetching] = useTransition();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

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
  }, [debouncedFetchStores, isAdmin]);

  const handleSubmit = (values: z.infer<typeof MenuCategorySchema>) => {
    startTransition(async () => {
      try {
        const payload = {
          ...values,
          storeId: values.storeId as string,
        };

        if (type === "CREATE") {
          const res = await createCategory(payload);
          if (res.success) toast.success(res.message, { duration: 1500 });
        } else if (type === "UPDATE" && categoryId) {
          const res = await updateCategory(categoryId, payload);
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
    if (!categoryId || type === "CREATE") return;
    startFetching(async () => {
      try {
        const data = await getCategoryById(categoryId);
        if (data && !("error" in data)) {
          form.reset({
            name: data.name,
            storeId: data.storeId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [form, categoryId, type]);

  useEffect(() => {
    if (!session || !isAdmin) return;
    startFetching(async () => {
      try {
        const stores = await getStoreById(session.user.storeId as string);
        if (stores && !("error" in stores)) {
          setStoresData([{ value: stores.id, label: stores.name }]);
          form.setValue("storeId", stores.id);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [form, session, isAdmin]);

  const formDisabled = isFetching || isPending || type === "DETAIL";

  return (
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
                  placeholder="Masukkan Nama Kategori"
                  className="input input-bordered w-full"
                  {...field}
                  disabled={formDisabled}
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
              <FormLabel>Toko</FormLabel>
              <FormControl>
                <Combobox
                  options={storesData}
                  value={field.value}
                  onChange={field.onChange}
                  onSearch={handleSearch}
                  isLoading={isSearching}
                  placeholder="Pilih Toko"
                  disabled={formDisabled || isAdmin}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type !== "DETAIL" && (
          <Button type="submit" className="ml-auto flex" disabled={isPending}>
            {getButtonText(type, "Kategori", isPending)}
            {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default FormMenuCategory;
