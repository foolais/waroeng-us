"use client";

import DialogForm from "@/components/dialog/dialog-form";
import FormMenuCategory from "@/components/form/menu/form-menu-category";
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
import { deleteCategory } from "@/lib/action/action-category";
import { InfoIcon, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface iProps {
  id: string;
  name: string;
}

const TableActionCategory = ({ id, name }: iProps) => {
  const [openStatus, setOpenStatus] = useState({
    value: false,
    type: "",
  });
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    try {
      startTransition(async () => {
        const res = await deleteCategory(id);
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
        title={
          openStatus.type === "detail"
            ? "Detail Kategori Menu"
            : "Perbarui Kategori Menu"
        }
      >
        {openStatus.type === "detail" ? (
          <FormMenuCategory
            type="DETAIL"
            categoryId={id}
            onClose={() => setOpenStatus({ value: false, type: "" })}
          />
        ) : openStatus.type === "update" ? (
          <FormMenuCategory
            type="UPDATE"
            categoryId={id}
            onClose={() => setOpenStatus({ value: false, type: "" })}
          />
        ) : null}
      </DialogForm>
    </>
  );
};

export default TableActionCategory;
