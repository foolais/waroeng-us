"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogForm from "../dialog-form";
import { PlusIcon } from "lucide-react";
import FormTable from "@/components/form/table/form-table";

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
        <FormTable type="CREATE" onClose={() => setIsOpen(false)} />
      </DialogForm>
    </>
  );
};

export default DialogCreateTable;
