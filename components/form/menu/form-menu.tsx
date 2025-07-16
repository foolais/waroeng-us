"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAllCategory } from "@/lib/action/action-category";
import { getAllStore, getStoreById } from "@/lib/action/action-store";
import { MenuSchema } from "@/lib/zod/zod";
import { useMenuImage } from "@/store/menu/useMenuFilter";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
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
import ImageUploader from "../image-uploader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuStatusOption } from "@/lib/data";
import Combobox from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { getButtonText } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { createMenu, getMenuById, updateMenu } from "@/lib/action/action-menu";

interface iProps {
  menuId?: string;
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

const FormMenu = ({ menuId, type, onClose }: iProps) => {
  const form = useForm<z.infer<typeof MenuSchema>>({
    resolver: zodResolver(MenuSchema),
    defaultValues: {
      name: "",
      image: "",
      price: "",
      status: "AVAILABLE",
      storeId: "",
      categoryId: "",
    },
  });

  const [isSearchingStore, setIsSearchingStore] = useState(false);
  const [isSearchingCategory, setIsSearchingCategory] = useState(false);
  const [storeValue, setStoreValue] = useState("");
  const [storesData, setStoresData] = useState<
    { value: string; label: string }[]
  >([]);
  const [categoriesData, setCategoriesData] = useState<
    { value: string; label: string }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [isFetching, startFetching] = useTransition();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const { setUrl } = useMenuImage();

  // Memoized debounced fetch function
  const debouncedFetchStores = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          setIsSearchingStore(true);
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
          setIsSearchingStore(false);
        }
      }, 300),
    [],
  );

  const debouncedFetchCategories = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          setIsSearchingCategory(true);
          const { data } = await getAllCategory(
            1,
            encodeURIComponent(query),
            session?.user.storeId ?? storeValue,
          );
          const mappedData = Array.isArray(data)
            ? data.map((store) => ({ value: store.id, label: store.name }))
            : [];
          setCategoriesData(mappedData);
        } catch (error) {
          console.error("Search error:", error);
          toast.error(
            `Failed to search stores: ${error instanceof Error ? error.message : String(error)}`,
          );
          setCategoriesData([]);
        } finally {
          setIsSearchingCategory(false);
        }
      }, 300),
    [session?.user.storeId, storeValue],
  );

  // Handle search query changes
  const handleSearchStore = useCallback(
    (query: string) => {
      debouncedFetchStores(query.trim());
    },
    [debouncedFetchStores],
  );

  const handleSearchCategory = useCallback(
    (query: string) => {
      debouncedFetchCategories(query.trim());
    },
    [debouncedFetchCategories],
  );

  // Initial store data load
  useEffect(() => {
    debouncedFetchStores("");
    return () => debouncedFetchStores.cancel();
  }, [debouncedFetchStores, isAdmin]);

  useEffect(() => {
    debouncedFetchCategories("");
    return () => debouncedFetchCategories.cancel();
  }, [debouncedFetchCategories, storeValue]);

  // fetching detail menu
  useEffect(() => {
    if (!menuId || type === "CREATE") return;
    startFetching(async () => {
      try {
        const data = await getMenuById(menuId);
        if (data && !("error" in data)) {
          form.reset({
            name: data.name,
            image: data.image as string,
            price: data.price.toString(),
            status: data.status,
            storeId: data.storeId,
            categoryId: data.categoryId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [form, menuId, type]);

  // Fetch store when user role admin
  useEffect(() => {
    if (!session || !isAdmin) return;
    startFetching(async () => {
      try {
        const stores = await getStoreById(session.user.storeId as string);
        if (stores && !("error" in stores)) {
          setStoresData([{ value: stores.id, label: stores.name }]);
          form.setValue("storeId", stores.id);
          setStoreValue(stores.id);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [form, session, isAdmin]);

  const handleSubmit = (values: z.infer<typeof MenuSchema>) => {
    startTransition(async () => {
      try {
        const payload = {
          ...values,
          image: values.image as string,
          storeId: values.storeId as string,
          categoryId: values.categoryId as string,
        };
        if (type === "CREATE") {
          const res = await createMenu(payload);
          if (res.success) toast.success(res.message, { duration: 1500 });
        } else if (type === "UPDATE" && menuId) {
          const res = await updateMenu(menuId, payload);
          if (res.success) toast.success(res.message, { duration: 1500 });
        }
        onClose();
        form.reset();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const formDisabled = isFetching || isPending || type === "DETAIL";
  const categoriesDisabled = !storeValue;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <ImageUploader
                    initialImage={
                      field.value instanceof File
                        ? URL.createObjectURL(field.value)
                        : field.value
                    }
                    onImageUpload={(url) => {
                      field.onChange(url);
                      setUrl(url);
                    }}
                    onImageRemove={() => {
                      field.onChange(undefined);
                    }}
                    disabled={formDisabled}
                    type={type}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden w-full items-center gap-4 md:grid">
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
                        onSetStore={setStoreValue}
                        onSearch={handleSearchStore}
                        isLoading={isSearchingStore}
                        placeholder="Pilih Toko"
                        disabled={formDisabled || isAdmin}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid w-full items-center gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan Nama"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan Harga"
                      {...field}
                      type="number"
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
                    defaultValue="ACTIVE"
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full cursor-pointer"
                        disabled={formDisabled}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {menuStatusOption.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Combobox
                      options={categoriesData}
                      value={field.value}
                      onChange={field.onChange}
                      onSearch={handleSearchCategory}
                      isLoading={isSearchingCategory}
                      placeholder="Pilih Kategori"
                      disabled={formDisabled || categoriesDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:hidden">
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
                        onSetStore={setStoreValue}
                        onSearch={handleSearchStore}
                        isLoading={isSearchingStore}
                        placeholder="Pilih Toko"
                        disabled={formDisabled || isAdmin}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {type !== "DETAIL" && (
          <Button type="submit" className="ml-auto flex" disabled={isPending}>
            {getButtonText(type, "Menu", isPending)}
            {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default FormMenu;
