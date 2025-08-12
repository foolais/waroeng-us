"use client";

import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import DialogForm from "./dialog-form";
import { useSession } from "next-auth/react";
import FormUser from "../form/user/form-user";

const DialogProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (session?.user && status === "authenticated") {
      if (session.user.id) {
        setUserId(session.user.id);
      }
    }
  }, [session, status]);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="flex w-full justify-start"
        onClick={handleOpenDialog}
      >
        <User color={"var(--color-primary)"} />
        <span>Profil</span>
      </Button>
      <DialogForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Profil"
        contentClassName="max-h-[650px] overflow-y-auto"
      >
        <FormUser
          type="UPDATE"
          onClose={() => setIsOpen(false)}
          userId={userId}
        />
      </DialogForm>
    </>
  );
};

export default DialogProfileButton;
