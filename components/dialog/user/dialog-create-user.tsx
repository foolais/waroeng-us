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
import { useUserImage } from "@/store/user/useUserFilter";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const DialogCreateUser = () => {
  const [open, setOpen] = useState(false);
  const { url, setUrl } = useUserImage();

  const onClose = async () => {
    if (!url) return;

    const formData = new FormData();
    formData.set("file", url);
    try {
      await fetch(`/api/upload?imageUrl=${url}`, {
        method: "DELETE",
      });
      setUrl("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <span className="sm:hidden md:block">Create</span>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[650px] overflow-y-auto"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onCloseAutoFocus={onClose}
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
