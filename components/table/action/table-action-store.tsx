"use client";

import DialogForm from "@/components/dialog/dialog-form";
import FormStore from "@/components/form/store/form-store";
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
import { deleteStore } from "@/lib/action/action-store";
import { InfoIcon, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface iProps {
  id: string;
  name: string;
}

const TableActionStore = ({ id, name }: iProps) => {
  const [openStatus, setOpenStatus] = useState({
    value: false,
    type: "",
  });
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    try {
      startTransition(async () => {
        await deleteStore(id);
        toast.success("Store deleted successfully", { duration: 1500 });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi untuk {name}</DropdownMenuLabel>
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
                  {`Apakah kamu yakin ingin menghapus ${name}?`}
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
        title={openStatus.type === "detail" ? `Detail Toko` : `Update Toko`}
      >
        {openStatus.type === "detail" ? (
          <FormStore
            type="DETAIL"
            onClose={() => setOpenStatus({ value: false, type: "" })}
            storeId={id}
          />
        ) : openStatus.type === "update" ? (
          <FormStore
            type="UPDATE"
            onClose={() => setOpenStatus({ value: false, type: "" })}
            storeId={id}
          />
        ) : null}
      </DialogForm>
    </>
  );
};

export default TableActionStore;
