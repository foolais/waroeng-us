"use client";

import FormUser from "@/components/form/user/form-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserImage } from "@/store/user/useUserFilter";
import { PlusIcon, X } from "lucide-react";
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
          <span className="sm:hidden md:block">Buat</span>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[650px] overflow-y-auto"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>Buat Pengguna Baru</DialogTitle>
          <DialogClose asChild className="absolute top-4 right-4 z-10">
            <Button onClick={onClose} size="icon" variant="destructive">
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>
        <FormUser type="CREATE" onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateUser;
