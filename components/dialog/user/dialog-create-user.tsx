"use client";

import FormCreateUser from "@/components/form/user/form-create-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const DialogCreateUser = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <span className="sm:hidden md:block">Create</span>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[600px] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>Create a New User</DialogTitle>
        </DialogHeader>
        <FormCreateUser />
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateUser;
