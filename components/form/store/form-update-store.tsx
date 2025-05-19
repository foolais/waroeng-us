import { getStoreById, updateStore } from "@/lib/action/action-store";
import { iFormStore } from "@/types/types";
import React, {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FormFieldCombobox, FormFieldInput } from "../form-field";
import { STORE_STATUS_OPTIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import FormStoreSkeleton from "./form-store-skeleton";

const FormUpdateStore = ({
  onCloseDialog,
  id,
}: {
  onCloseDialog: () => void;
  id: string;
}) => {
  const [formValues, setFormValues] = useState<iFormStore>({
    name: "",
    status: "ACTIVE",
  });
  const hasRun = useRef(false);
  const [isPending, startTransition] = useTransition();

  const [state, formAction, isLoading] = useActionState(
    updateStore.bind(null, id),
    null,
  );

  useEffect(() => {
    startTransition(async () => {
      const data = await getStoreById(id);
      if (!("error" in data)) {
        setFormValues({
          name: data.name ?? "",
          status: data.status,
        });
      }
    });
  }, [id]);

  useEffect(() => {
    if (!hasRun.current && state?.success && state?.message) {
      toast.success(state.message, { duration: 1500 });
      onCloseDialog();
      hasRun.current = true;
    }
  }, [state, onCloseDialog]);

  if (isPending) return <FormStoreSkeleton />;

  return (
    <form id="form-update-store" action={formAction}>
      <div className="grid w-full items-center gap-4">
        <FormFieldInput
          name="name"
          label="Store Name"
          value={formValues.name}
          setFormValues={setFormValues}
          placeholder="Enter Store Name"
          error={state?.error && "name" in state.error ? state.error.name : []}
          disabled={isLoading}
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
        <Button disabled={isLoading} form="form-update-store">
          {isLoading ? "Updating..." : "Update Store"}
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </form>
  );
};

export default FormUpdateStore;
