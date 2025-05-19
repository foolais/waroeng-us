"use client";

import { iFromUser } from "@/types/types";
import { useActionState, useState } from "react";
import { FormFieldCombobox, FormFieldInput } from "../form-field";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createStore } from "@/lib/action/action-store";

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "CASHIER", label: "Cashier" },
];

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const FormCreateUser = () => {
  const [formValues, setFormValues] = useState<iFromUser>({
    image: "",
    name: "",
    email: "",
    gender: "MALE",
    phone: "",
    address: "",
    role: "CASHIER",
    storeId: "",
    password: "",
    confirmPassword: "",
  });

  const [state, formAction, isPending] = useActionState(createStore, null);

  return (
    <form id="form-create-user" action={formAction}>
      <div className="flex flex-col gap-2 md:flex-row md:gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex-center aspect-square h-[200px] w-[200px] rounded-md border-2 border-dashed object-cover">
            <ImageUp size={100} strokeWidth={1} />
          </div>
          {/* Desktop n Hidden when on mobile */}
          <div className="hidden w-full items-center gap-4 md:grid">
            <FormFieldCombobox
              name="role"
              label="Role"
              placeholder="Select role"
              data={roleOptions}
              value={formValues.role}
              setValue={() =>
                setFormValues((prev) => ({ ...prev, role: "CASHIER" }))
              }
              onChangeForm={(val) =>
                setFormValues((prev) => ({
                  ...prev,
                  role: val as "ADMIN" | "CASHIER",
                }))
              }
            />
            <FormFieldInput
              name="phone"
              label="Phone Number"
              value={formValues.phone ?? ""}
              setFormValues={setFormValues}
              placeholder="Enter Phone Number"
              type="phone"
            />
            <FormFieldInput
              name="address"
              label="Address"
              value={formValues.address ?? ""}
              setFormValues={setFormValues}
              placeholder="Enter Address"
            />
          </div>
        </div>
        <div className="grid w-full items-center gap-4">
          <FormFieldInput
            name="name"
            label="Name"
            value={formValues.name}
            setFormValues={setFormValues}
            placeholder="Enter Name"
          />
          <FormFieldInput
            name="email"
            label="Email"
            value={formValues.email}
            setFormValues={setFormValues}
            placeholder="Enter Email"
            type="email"
          />
          <FormFieldCombobox
            name="gender"
            label="Gender"
            placeholder="Select gender"
            data={genderOptions}
            value={formValues.gender}
            setValue={() =>
              setFormValues((prev) => ({ ...prev, gender: "MALE" }))
            }
            onChangeForm={(val) =>
              setFormValues((prev) => ({
                ...prev,
                gender: val as "MALE" | "FEMALE",
              }))
            }
          />
          <div className="grid w-full items-center gap-4 md:hidden">
            <FormFieldInput
              name="phone"
              label="Phone Number"
              value={formValues.phone ?? ""}
              setFormValues={setFormValues}
              placeholder="Enter Phone Number"
              type="phone"
            />
            <FormFieldInput
              name="address"
              label="Address"
              value={formValues.address ?? ""}
              setFormValues={setFormValues}
              placeholder="Enter Address"
            />
            <FormFieldCombobox
              name="role"
              label="Role"
              placeholder="Select role"
              data={roleOptions}
              value={formValues.role}
              setValue={() =>
                setFormValues((prev) => ({ ...prev, role: "CASHIER" }))
              }
              onChangeForm={(val) =>
                setFormValues((prev) => ({
                  ...prev,
                  role: val as "ADMIN" | "CASHIER",
                }))
              }
            />
          </div>
          <FormFieldCombobox
            name="storeId"
            label="Store"
            placeholder="Select Store"
            data={roleOptions}
            value={formValues.role}
            setValue={() =>
              setFormValues((prev) => ({ ...prev, role: "CASHIER" }))
            }
            onChangeForm={(val) =>
              setFormValues((prev) => ({
                ...prev,
                role: val as "ADMIN" | "CASHIER",
              }))
            }
          />
          <FormFieldInput
            name="password"
            label="Password"
            value={formValues.password}
            setFormValues={setFormValues}
            placeholder="Enter Password"
            type="password"
          />
          <FormFieldInput
            name="confirmPassword"
            label="Confirm Password"
            value={formValues.confirmPassword}
            setFormValues={setFormValues}
            placeholder="Enter Confirm Password"
            type="password"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button disabled={isPending} form="form-create-user">
          {isPending ? "Creating..." : "Create User"}
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </form>
  );
};

export default FormCreateUser;
