"use client";

import DialogForm from "@/components/dialog/dialog-form";
import FormOrder from "@/components/form/order/form-order";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteOrder } from "@/lib/action/action-order";
import { InfoIcon, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface iProps {
  id: string;
  no: string;
}

const TableActionOrder = ({ id, no }: iProps) => {
  const [openStatus, setOpenStatus] = useState({
    value: false,
    type: "",
  });
  const [isPending, startTrasition] = useTransition();

  const handleDelete = () => {
    try {
      startTrasition(async () => {
        const res = await deleteOrder(id);
        if ("success" in res && res.success)
          toast.success(res.message, { duration: 1500 });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Aksi untuk <span className="font-semibold">{no}</span>
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setOpenStatus({ value: true, type: "detail" })}
            className="cursor-pointer"
          >
            <InfoIcon />
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenStatus({ value: true, type: "update" })}
            className="cursor-pointer"
          >
            <PencilIcon />
            Perbarui
          </DropdownMenuItem>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2Icon color="red" />
                Hapus
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-500">
                  {`Apakah kamu yakin ingin menghapus ${no}?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/70"
                  onClick={handleDelete}
                >
                  {isPending ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogForm
        isOpen={openStatus.value}
        onClose={() => setOpenStatus({ value: false, type: "" })}
        title={openStatus.type === "detail" ? `Detail Order` : `Perbarui Order`}
        contentClassName="h-[90vh] md:h-[80vh] min-w-[90vw] overflow-y-auto flex flex-col"
      >
        {openStatus.type === "detail" ? (
          <FormOrder
            type="DETAIL"
            onClose={() => setOpenStatus({ value: false, type: "" })}
            orderId={id}
          />
        ) : openStatus.type === "update" ? (
          <FormOrder
            type="UPDATE"
            onClose={() => setOpenStatus({ value: false, type: "" })}
            orderId={id}
          />
        ) : null}
      </DialogForm>
    </>
  );
};

export default TableActionOrder;
