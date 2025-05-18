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
import { cn } from "@/lib/utils";

const DialogCreateStore = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn("flex items-center gap-1", className)}>
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
          <DialogTitle>Create a New Store</DialogTitle>
        </DialogHeader>
        <FormCreateStore onCloseDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateStore;
