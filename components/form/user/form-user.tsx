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
import { getAllStore } from "@/lib/action/action-store";
import { toast } from "sonner";
import Combobox from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { getButtonText } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { createUserNew } from "@/lib/action/action-user";

interface FormUserProps {
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

const FormUser = ({ type, onClose }: FormUserProps) => {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      image: undefined,
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
  const [isPending, startTranstion] = useTransition();

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

  // Initial data load
  useEffect(() => {
    debouncedFetchStores("");
    return () => debouncedFetchStores.cancel();
  }, [debouncedFetchStores]);

  const handleSubmit = (values: z.infer<typeof UserSchema>) => {
    startTranstion(async () => {
      try {
        if (type === "CREATE") {
          const res = await createUserNew({
            ...values,
            image: values.image as string,
            gender: values.gender as "MALE" | "FEMALE",
            role: values.role as "ADMIN" | "CASHIER",
          });
          if (res.success) toast.success(res.message, { duration: 1500 });
        }
        onClose();
        form.reset();
      } catch (error) {
        console.log(error);
      }
    });
  };

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
                      }}
                      onImageRemove={() => {
                        field.onChange(undefined);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Desktop only fields */}
              <div className="hidden w-full items-center gap-4 md:grid">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue="CASHIER"
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select User Role" />
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
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="phone"
                          placeholder="Enter Phone Number"
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Address" {...field} />
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
                      <Input placeholder="Enter name" {...field} />
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
                        placeholder="Enter email"
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
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="MALE"
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select gender" />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="phone"
                          placeholder="Enter Phone Number"
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Address" {...field} />
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
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue="CASHIER"
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select User Role" />
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
                    <FormLabel>Store</FormLabel>
                    <FormControl>
                      <Combobox
                        options={storesData}
                        value={field.value}
                        onChange={field.onChange}
                        onSearch={handleSearch}
                        isLoading={isSearching}
                        placeholder="Select Store"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter Password"
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {type !== "DETAIL" && (
            <Button type="submit" className="ml-auto flex" disabled={isPending}>
              {getButtonText(type, "User", isPending)}
              {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

export default FormUser;
