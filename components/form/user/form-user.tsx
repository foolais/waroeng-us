"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserSchema } from "@/lib/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImageUploader from "../image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genderOptions, roleOptions } from "@/lib/data";
import { Input } from "@/components/ui/input";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { debounce } from "lodash";
import { getAllStore, getStoreById } from "@/lib/action/action-store";
import { toast } from "sonner";
import Combobox from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { getButtonText } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { createUser, getUserById, updateUser } from "@/lib/action/action-user";
import { useUserImage } from "@/store/user/useUserFilter";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface FormUserProps {
  userId?: string;
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

const FormUser = ({ userId, type, onClose }: FormUserProps) => {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      image: "",
      name: "",
      email: "",
      gender: "MALE",
      address: "",
      phone: "",
      role: "CASHIER",
      storeId: "",
      password: "",
      confirmPassword: "",
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
  const pathName = usePathname();

  const { setUrl } = useUserImage();

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

  // GET detail user
  useEffect(() => {
    if (!userId || type === "CREATE") return;
    startFetching(async () => {
      try {
        const data = await getUserById(userId);
        if (data && !("error" in data)) {
          form.reset({
            image: data.image as string,
            name: data.name,
            email: data.email,
            gender: data.gender as "MALE" | "FEMALE",
            role: data.role as "ADMIN" | "CASHIER",
            storeId: data.storeId || undefined,
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [userId, type, form]);

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

  const handleSubmit = (values: z.infer<typeof UserSchema>) => {
    startTransition(async () => {
      try {
        const payload = {
          ...values,
          image: values.image as string,
          gender: values.gender as "MALE" | "FEMALE",
          role: values.role as "ADMIN" | "CASHIER",
        };
        if (type === "CREATE") {
          const res = await createUser(payload);
          if (res.success) toast.success(res.message, { duration: 1500 });
        } else if (type === "UPDATE" && userId) {
          const res = await updateUser(userId, payload);
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

  return (
    <>
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
              {/* Desktop only fields */}
              <div className="hidden w-full items-center gap-4 md:grid">
                {/* Hide role field for CREATE to change it bellow storeId */}
                {type === "CREATE" && (
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peran</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue="CASHIER"
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="w-full cursor-pointer"
                              disabled={formDisabled}
                            >
                              <SelectValue placeholder="Pilih Peran" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleOptions.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input
                          type="phone"
                          placeholder="Masukkan Nomor Telepon"
                          disabled={formDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan Alamat"
                          {...field}
                          disabled={formDisabled}
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
                    <FormLabel>Nama</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Masukkan Email"
                        disabled={formDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="MALE"
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="w-full cursor-pointer"
                          disabled={formDisabled}
                        >
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Mobile only fields */}
              <div className="grid w-full items-center gap-4 md:hidden">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input
                          type="phone"
                          placeholder="Masukkan Nomor Telepon"
                          disabled={formDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan Alamat"
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peran</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue="CASHIER"
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="w-full cursor-pointer"
                            disabled={formDisabled}
                          >
                            <SelectValue placeholder="Pilih Peran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* END of Mobile only fields */}
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
                        disabled={
                          formDisabled || isAdmin || pathName.includes("admin")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {type !== "CREATE" && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peran</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue="CASHIER"
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="w-full cursor-pointer"
                            disabled={formDisabled}
                          >
                            <SelectValue placeholder="Pilih Peran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {type === "CREATE" && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Masukkan Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Masukkan Konfirmasi Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </div>
          {type !== "DETAIL" && (
            <Button type="submit" className="ml-auto flex" disabled={isPending}>
              {getButtonText(type, "Pengguna", isPending)}
              {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

export default FormUser;
