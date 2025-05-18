"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FormFieldInput } from "../form-field";
import { Button } from "@/components/ui/button";
import { createStore } from "@/lib/action/action-store";
import { Loader2 } from "lucide-react";

interface iFormStore {
  name: string;
}

const FormCreateStore = ({ onCloseDialog }: { onCloseDialog: () => void }) => {
  const [formValues, setFormValues] = useState<iFormStore>({
    name: "",
  });
  const [state, formAction, isPending] = useActionState(createStore, null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && state?.success && state?.message) {
      alert(state.message);
      //   toast.success(state.message, { duration: 1500 });
      onCloseDialog();
      hasRun.current = true;
    }
  }, [state, onCloseDialog]);

  return (
    <form id="form-create-store" action={formAction}>
      <div className="grid w-full items-center gap-4">
        <FormFieldInput
          name="name"
          label="Store Name"
          value={formValues.name}
          setFormValues={setFormValues}
          placeholder="Enter Store Name"
          error={state?.error && "name" in state.error ? state.error.name : []}
          disabled={isPending}
        />
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button disabled={isPending} form="form-create-store">
          {isPending ? "Creating..." : "Create Store"}
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </form>
  );
};

export default FormCreateStore;
