"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import FormCreateStore from "../form/super/form-create-store";

const DialogCreateStore = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-center gap-1 sm:w-auto">
          <span className="">Create</span>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>Create a new store</DialogTitle>
        </DialogHeader>
        <FormCreateStore onCloseDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateStore;
