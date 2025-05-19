import { getStoreById } from "@/lib/action/action-store";
import { iFormStore } from "@/types/types";
import React, { useEffect, useState, useTransition } from "react";
import { FormFieldInput } from "../form-field";
import FormStoreSkeleton from "./form-store-skeleton";

const FormDetailStore = ({ id }: { id: string }) => {
  const [formValues, setFormValues] = useState<iFormStore>({
    name: "",
    status: "ACTIVE",
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getStoreById(id);
      if (!("error" in data)) {
        setFormValues({
          name: data.name ?? "",
          status: data.status ?? "ACTIVE",
        });
      }
    });
  }, [id]);

  if (isPending) return <FormStoreSkeleton />;

  return (
    <form id="form-detail-store">
      <div className="grid w-full items-center gap-4">
        <FormFieldInput
          name="name"
          label="Store Name"
          value={formValues.name}
          disabled
        />
        <FormFieldInput
          name="status"
          label="Status"
          value={formValues.status}
          disabled
        />
      </div>
    </form>
  );
};

export default FormDetailStore;
