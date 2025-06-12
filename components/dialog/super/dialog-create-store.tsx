"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import FormStore from "@/components/form/store/form-store";
import DialogForm from "../dialog-form";

const DialogCreateStore = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className={cn("flex items-center gap-1", className)}
        onClick={() => setIsOpen(true)}
      >
        <span className="">Create</span>
        <PlusIcon />
      </Button>
      <DialogForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create a New Store"
      >
        <FormStore type="CREATE" onClose={() => setIsOpen(false)} />
      </DialogForm>
    </>
  );
};

export default DialogCreateStore;
