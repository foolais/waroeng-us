"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogForm from "../dialog-form";
import { PlusIcon } from "lucide-react";

const DialogCreateTable = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <span>Buat</span>
        <PlusIcon />
      </Button>
      <DialogForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Buat Meja Baru"
      >
        <div></div>
      </DialogForm>
    </>
  );
};

export default DialogCreateTable;
