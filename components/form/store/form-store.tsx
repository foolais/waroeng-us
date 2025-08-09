"use client";

import { StoreSchema } from "@/lib/zod/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { storeStatusOptions } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { getButtonText } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useTransition } from "react";
import {
  createStore,
  getStoreById,
  updateStore,
} from "@/lib/action/action-store";
import { toast } from "sonner";
import FormStoreSkeleton from "./form-store-skeleton";

interface FormStoreProps {
  storeId?: string;
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

const FormStore = ({ type, onClose, storeId }: FormStoreProps) => {
  const form = useForm<z.infer<typeof StoreSchema>>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
      status: "ACTIVE",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isFetching, startFetching] = useTransition();

  const handleSubmit = (values: z.infer<typeof StoreSchema>) => {
    startTransition(async () => {
      try {
        if (type === "CREATE") {
          const res = await createStore(values);
          if (res.success) toast.success(res.message, { duration: 1500 });
        } else if (type === "UPDATE" && storeId) {
          const res = await updateStore(storeId, values);
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
    if (!storeId || type === "CREATE") return;
    startFetching(async () => {
      try {
        const data = await getStoreById(storeId);
        if (data && !("error" in data)) {
          form.reset({
            name: data.name,
            status: data.status,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [storeId, type, form]);

  return (
    <>
      {isFetching ? (
        <FormStoreSkeleton />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan Nama Toko"
                      className="w-full"
                      disabled={isPending || type === "DETAIL"}
                      {...field}
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
                        disabled={isPending || type === "DETAIL"}
                      >
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {storeStatusOptions.map((option) => (
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
              <Button
                type="submit"
                className="ml-auto flex"
                disabled={isPending}
              >
                {getButtonText(type, "Toko", isPending)}
                {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
              </Button>
            )}
          </form>
        </Form>
      )}
    </>
  );
};

export default FormStore;
