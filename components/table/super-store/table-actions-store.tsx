"use client";

import DialogForm from "@/components/dialog/dialog-form";
import FormDetailStore from "@/components/form/super/store/form-detail-store";
import FormUpdateStore from "@/components/form/super/store/form-update-store";
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
import { InfoIcon, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface iProps {
  id: string;
  name: string;
}

const TableActionStore = ({ id, name }: iProps) => {
  const [openStatus, setOpenStatus] = useState({
    value: false,
    type: "",
  });

  const handleDelete = async () => {
    try {
      console.log(name);
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
          <DropdownMenuLabel>Actions for {name}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setOpenStatus({ value: true, type: "detail" })}
            className="cursor-pointer"
          >
            <InfoIcon />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenStatus({ value: true, type: "update" })}
            className="cursor-pointer"
          >
            <PencilIcon />
            Update
          </DropdownMenuItem>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2Icon color="red" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-500">
                  {`Are you sure to delete ${name}?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  store
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/70"
                  onClick={handleDelete}
                >
                  Yes
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
            ? `Detail for ${name}`
            : `Update for ${name}`
        }
        description={
          openStatus.type === "detail"
            ? `Detail for ${name}`
            : `Update for ${name}`
        }
      >
        {openStatus.type === "detail" ? (
          <FormDetailStore id={id} />
        ) : openStatus.type === "update" ? (
          <FormUpdateStore
            onCloseDialog={() => setOpenStatus({ value: false, type: "" })}
            id={id}
          />
        ) : null}
      </DialogForm>
    </>
  );
};

export default TableActionStore;
