"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FormFieldCombobox, FormFieldInput } from "../form-field";
import { Button } from "@/components/ui/button";
import { createStore } from "@/lib/action/action-store";
import { Loader2 } from "lucide-react";
import { STORE_STATUS_OPTIONS } from "@/lib/data";
import { toast } from "sonner";
import { iFormStore } from "@/types/types";

const FormCreateStore = ({ onCloseDialog }: { onCloseDialog: () => void }) => {
  const [formValues, setFormValues] = useState<iFormStore>({
    name: "",
    status: "ACTIVE",
  });
  const hasRun = useRef(false);
  const [state, formAction, isPending] = useActionState(createStore, null);

  useEffect(() => {
    if (!hasRun.current && state?.success && state?.message) {
      toast.success(state.message, { duration: 1500 });
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
        <FormFieldCombobox
          name="status"
          label="Status"
          placeholder="Select category"
          data={STORE_STATUS_OPTIONS}
          value={formValues.status}
          setValue={() =>
            setFormValues((prev) => ({ ...prev, status: "ACTIVE" }))
          }
          onChangeForm={(val) => {
            setFormValues((prev) => ({
              ...prev,
              status: val as "ACTIVE" | "INACTIVE",
            }));
          }}
          error={
            state?.error && "status" in state.error ? state.error.status : []
          }
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
