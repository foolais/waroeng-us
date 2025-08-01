"use client";

import { KeyRound } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import DialogForm from "./dialog-form";
import FormChangePassword from "../form/user/form-change-password";

const DialogChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="flex w-full justify-start"
        onClick={() => setIsOpen(true)}
      >
        <KeyRound color={"var(--color-primary)"} />
        <span>Ganti Password</span>
      </Button>
      <DialogForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Ganti Password"
      >
        <FormChangePassword onClose={() => setIsOpen(false)} />
      </DialogForm>
    </>
  );
};

export default DialogChangePassword;
