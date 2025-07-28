/* eslint-disable react-hooks/exhaustive-deps */
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllMenu } from "@/lib/action/action-menu";
import { getAllTable } from "@/lib/action/action-table";
import {
  orderStatusOptions,
  orderTypeOptions,
  paymentTypeOptions,
} from "@/lib/data";
import { formatPrice, getButtonText } from "@/lib/utils";
import { orderSchema } from "@/lib/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LogoImage from "@/public/logo.png";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getOrderById, updateOrder } from "@/lib/action/action-order";
import { useOrderSelectedTable } from "@/store/order/useOrderFilter";

interface FormOrderProps {
  orderId?: string;
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

interface MenuItem {
  value: string;
  label: string;
  price: number;
  image?: string;
}

interface TableOption {
  value: string;
  label: string;
}

const FormOrder = ({ orderId, type, onClose }: FormOrderProps) => {
  const { data: session, status } = useSession();
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: "PENDING",
      type: "TAKE_AWAY",
      total: 0,
      tableId: "",
      notes: "",
      orderNumber: "",
      orderItem: [
        {
          menuId: "",
          quantity: 0,
          price: 0,
        },
      ],
      transaction: {
        method: "CASH",
      },
    },
  });

  const { selectedTableData, setSelectedTable } = useOrderSelectedTable();

  const [tableId, setTableId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableOption[]>([]);
  const [menuSearchData, setMenuSearchData] = useState<{
    [key: string]: MenuItem[];
  }>({});
  const [isFetchingTable, setIsFetchingTable] = useState(false);
  const [menuFetchingStates, setMenuFetchingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [isPending, startTransition] = useTransition();
  const [isFetching, startFetching] = useTransition();

  const formDisabled = type === "DETAIL" || isFetching;
  const storeId = session?.user.storeId;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderItem",
  });

  // [START] HANDLE COMBOBOX TABLES
  const fetchTables = useMemo(
    () =>
      debounce(async (query: string = "", status?: "ALL" | "AVAILABLE") => {
        if (!storeId) return;

        try {
          setIsFetchingTable(true);
          const { data } = await getAllTable(
            1,
            query,
            status ?? "AVAILABLE",
            storeId,
          );
          const mappedData: TableOption[] = Array.isArray(data)
            ? data.map((table) => ({ value: table.id, label: table.name }))
            : [];

          const isSelectedTableIncluded = mappedData.some(
            (table) => table.value === selectedTableData?.value,
          );

          if (selectedTableData?.value && !isSelectedTableIncluded) {
            setTableData([selectedTableData, ...mappedData]);
          } else {
            setTableData(mappedData);
          }
        } catch (error) {
          console.log(error);
          toast.error(
            `Failed to search stores: ${error instanceof Error ? error.message : String(error)}`,
          );
          setTableData([]);
        } finally {
          setIsFetchingTable(false);
        }
      }),
    [storeId],
  );

  const debouncedFetchTables = useMemo(
    () => debounce(fetchTables, 300),
    [storeId],
  );

  const handleSearchTable = useCallback(
    (query: string) => {
      debouncedFetchTables(query.trim());
    },
    [debouncedFetchTables],
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchTables();
    }
  }, [status, storeId]);

  useEffect(() => {
    return () => {
      debouncedFetchTables.cancel();
    };
  }, [debouncedFetchTables]);
  // [END] HANDLE COMBOBOX TABLES

  // [START] HANDLE COMBOBOX MENUS
  const fetchMenus = useMemo(
    () =>
      debounce(async (query: string = "", index: number) => {
        if (!storeId) return;

        try {
          setMenuFetchingStates((prev) => ({ ...prev, [index]: true }));
          const { data } = await getAllMenu(1, query, "AVAILABLE", storeId);
          const mappedData = Array.isArray(data)
            ? data.map((menu) => ({
                value: menu.id,
                label: menu.name,
                price: menu.price,
                image: menu.image ?? "",
              }))
            : [];
          setMenuSearchData((prev) => ({ ...prev, [index]: mappedData }));
        } catch (error) {
          console.log(error);
          toast.error(
            `Failed to search menus: ${error instanceof Error ? error.message : String(error)}`,
          );
          setMenuSearchData((prev) => ({ ...prev, [index]: [] }));
        } finally {
          setMenuFetchingStates((prev) => ({ ...prev, [index]: false }));
        }
      }),
    [storeId],
  );

  const debouncedFetchMenus = useMemo(
    () => debounce(fetchMenus, 300),
    [storeId],
  );

  const handleSearchMenu = useCallback(
    (query: string, index: number) => {
      debouncedFetchMenus(query.trim(), index);
    },
    [debouncedFetchMenus],
  );

  const handleMenuSelect = (index: number, menuId: string) => {
    const menuList = menuSearchData[index] || [];
    const selectedMenu = menuList.find((menu) => menu.value === menuId);
    if (selectedMenu) {
      form.setValue(`orderItem.${index}.menuId`, menuId);
      form.setValue(`orderItem.${index}.price`, selectedMenu.price);
      form.setValue(`orderItem.${index}.quantity`, 1);
    }
    setSelectedQuantity((prev) => prev + 1);
  };

  useEffect(() => {
    return () => {
      debouncedFetchMenus.cancel();
    };
  }, [debouncedFetchMenus]);
  // [END] HANDLE COMBOBOX MENUS

  const handleAddItem = () => {
    const newIndex = fields.length;
    append({
      menuId: "",
      quantity: 1,
      price: 0,
    });
    setMenuSearchData((prev) => ({ ...prev, [newIndex]: [] }));
    setSelectedQuantity((prev) => prev + 1);
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
    setMenuSearchData((prev) => {
      const newData = { ...prev };
      delete newData[index];
      return newData;
    });
    setSelectedQuantity((prev) => prev - 1);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const currentQuantity = form.getValues(`orderItem.${index}.quantity`);
    const newQuantity = currentQuantity + value;
    setSelectedQuantity((prev) => (value ? prev + 1 : prev - 1));

    if (newQuantity > 0) {
      form.setValue(`orderItem.${index}.quantity`, newQuantity);
    }
  };

  const handleSubmit = (values: z.infer<typeof orderSchema>) => {
    startTransition(async () => {
      try {
        const payload = {
          orderType: values.type,
          orderNumber: values.orderNumber ?? "",
          paymentType: values.transaction.method,
          tableId: values.tableId ?? null,
          notes: values.notes ?? null,
          totalPrice: values.total,
          items: values.orderItem.map((item) => ({
            id: item.menuId,
            quantity: item.quantity,
            price: item.price,
          })),
          status: values.status,
        };
        if (type === "UPDATE" && orderId) {
          const res = await updateOrder(orderId, payload);
          if ("success" in res && res.success) {
            toast.success(res.message, { duration: 1500 });
            onClose();
          } else if ("error" in res) toast.error(res.error, { duration: 1500 });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  // HANDLE GET DETAIL ORDER
  useEffect(() => {
    if (!orderId || type === "CREATE") return;
    startFetching(async () => {
      try {
        const data = await getOrderById(orderId);
        if (data && !("error" in data)) {
          const table = data.table;
          if (table) {
            setTableId(table.id);
            fetchTables(table.name, "ALL");
            setSelectedTable({ value: table.id, label: table.name });
          }

          form.reset({
            status: data.status,
            type: data.type,
            total: data.total,
            tableId: data.table?.id ?? undefined,
            notes: data.notes ?? undefined,
            orderNumber: data.orderNumber,
            orderItem: data.orderItems.map((item) => ({
              menuId: item.menu.id,
              price: item.price,
              quantity: item.quantity,
            })),
            transaction: {
              method: data.transaction?.method as "CASH" | "QR",
            },
          });

          data.orderItems.forEach((item, index) => {
            setMenuSearchData((prev) => ({
              ...prev,
              [index]: [
                {
                  value: item.menu.id,
                  label: item.menu.name,
                  price: item.price,
                  image: item.menu.image ?? "",
                },
              ],
            }));
          });

          setSelectedQuantity(data.orderItems.length);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [form, orderId, type]);

  // HANDLE TOTOAL PRICE
  useEffect(() => {
    const orderItem = form.getValues("orderItem");
    const sumItems = orderItem.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );
    setTotalPrice(sumItems);
    form.setValue("total", totalPrice);
  }, [selectedQuantity]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex h-full flex-1 flex-col md:flex-row">
            <div className="w-full space-y-4 py-3.5 md:w-2/5">
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Pesanan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="No Pesanan"
                        {...field}
                        disabled
                        readOnly
                        style={{ opacity: 100 }}
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
                    <FormLabel className="required">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="PENDING"
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
                        {orderStatusOptions.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            className="cursor-pointer"
                          >
                            {item.label}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">Tipe Pesanan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="DINE_IN"
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="w-full cursor-pointer"
                          disabled={formDisabled}
                        >
                          <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orderTypeOptions.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            className="cursor-pointer"
                          >
                            {item.label}
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
                name="tableId"
                render={() => (
                  <FormItem>
                    <FormLabel>Meja</FormLabel>
                    <FormControl>
                      <Combobox
                        disabled={isFetchingTable || formDisabled}
                        options={tableData}
                        placeholder="Pilih Meja"
                        value={tableId || ""}
                        onChange={(value) => {
                          setTableId(value || null);
                          form.setValue("tableId", value || "");
                        }}
                        onSearch={handleSearchTable}
                        isLoading={isFetchingTable}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transaction.method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">
                      Metode Pembayaran
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="CASH"
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="w-full cursor-pointer"
                          disabled={formDisabled}
                        >
                          <SelectValue placeholder="Pilih metode pembayaran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentTypeOptions.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            className="cursor-pointer"
                          >
                            {item.label}
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
                name="total"
                render={() => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Total Harga"
                        value={formatPrice(totalPrice)}
                        disabled
                        readOnly
                        style={{ opacity: 100 }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan catatan disini..."
                        {...field}
                        disabled={formDisabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full px-4 md:w-3/5">
              <h3 className="text-xl font-medium">Detail Pesanan</h3>
              <Button
                variant="outline"
                className="border-primary mt-2 w-full"
                onClick={handleAddItem}
                disabled={formDisabled}
              >
                Tambah Pesanan Baru <Plus />
              </Button>
              <Separator className="bg-primary my-4" />
              <div className="no-scrollbar grid h-full max-h-[50vh] flex-1 auto-rows-min gap-4 overflow-y-auto md:min-h-[50vh]">
                {fields.map((field, index) => {
                  const selectedMenuId = form.watch(
                    `orderItem.${index}.menuId`,
                  );
                  const menuList = menuSearchData[index] || [];
                  const selectedMenu = menuList.find(
                    (menu) => menu.value === selectedMenuId,
                  );
                  const quantity = form.watch(`orderItem.${index}.quantity`);
                  const price = form.watch(`orderItem.${index}.price`);

                  return (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 rounded-md border-[1.5px] px-2 py-3"
                    >
                      {selectedMenu && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={selectedMenu.image || LogoImage}
                            alt={selectedMenu.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <Combobox
                            disabled={formDisabled}
                            options={menuList}
                            placeholder="Pilih Menu"
                            value={selectedMenuId || ""}
                            onChange={(value) => handleMenuSelect(index, value)}
                            onSearch={(query) => handleSearchMenu(query, index)}
                            isLoading={menuFetchingStates[index] || false}
                            className={
                              selectedMenu ? "w-full" : "w-[85%] md:w-[90%]"
                            }
                          />
                          {!selectedMenu && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveItem(index)}
                              disabled={formDisabled}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {selectedMenu && (
                          <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                            <div className="mb-2 ml-2 text-sm font-medium md:my-0 md:ml-0">
                              {formatPrice(price * quantity)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(index, -1)}
                                disabled={formDisabled}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {quantity}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(index, 1)}
                                disabled={formDisabled}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveItem(index)}
                                disabled={formDisabled}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {type !== "DETAIL" && (
            <Button type="submit" className="ml-auto flex" disabled={isPending}>
              {getButtonText(type, "Order", isPending)}
              {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

export default FormOrder;
