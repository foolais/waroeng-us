"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogForm from "../dialog-form";
import FormMenuCategory from "@/components/form/menu/form-menu-category";
import { PlusIcon } from "lucide-react";

const DialogCreateMenuCategory = () => {
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
        title="Buat Kategori Menu"
        contentClassName="max-h-[650px] overflow-y-auto"
      >
        <FormMenuCategory type="CREATE" onClose={() => setIsOpen(false)} />
      </DialogForm>
    </>
  );
};

export default DialogCreateMenuCategory;
