"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogForm from "../dialog-form";

const DialogCreateMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <span>Buat</span>
      </Button>
      <DialogForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Buat Menu Baru"
        contentClassName="max-h-[650px] overflow-y-auto"
      >
        tes
      </DialogForm>
    </>
  );
};

export default DialogCreateMenu;
