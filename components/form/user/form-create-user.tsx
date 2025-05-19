"use client";

import { iFromUser } from "@/types/types";
import { useActionState, useRef, useState, useTransition } from "react";
import { FormFieldCombobox, FormFieldInput } from "../form-field";
import { ImageUp, Loader2, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createUser } from "@/lib/action/action-user";
import { type PutBlobResult } from "@vercel/blob";
import Image from "next/image";
import { useUserImage } from "@/store/user/useUserFilter";

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
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const { setUrl } = useUserImage();

  const inputImageRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(createUser, null);

  const handleUploadImage = () => {
    if (!inputImageRef.current?.files) return null;

    const image = inputImageRef.current.files[0];
    const formData = new FormData();
    formData.set("file", image);

    startTransition(async () => {
      setMessage("");
      try {
        const response = await fetch("/api/upload", {
          method: "PUT",
          body: formData,
        });
        const data = await response.json();
        if (response.status !== 200) {
          return setMessage(data.error);
        }
        setMessage("");
        const img = data as PutBlobResult;
        setImage(img.url);
        setFormValues((prev) => ({ ...prev, image: img.url }));
        setUrl(img.url);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const deleteImage = (image: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/upload?imageUrl=${image}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (response.status !== 200) {
          return setMessage(data.error);
        }
        setImage("");
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <form id="form-create-user" action={formAction}>
      <div className="flex flex-col gap-2 md:flex-row md:gap-4">
        <div className="flex flex-col gap-6">
          <div className="flex-center flex-col gap-2">
            <label
              htmlFor="input-image"
              className="flex-center relative aspect-square h-[200px] w-[200px] cursor-pointer flex-col rounded-md border-2 border-dashed object-cover"
            >
              {isUploading && (
                <div className="progress-loader">
                  <div className="progress" />
                </div>
              )}
              {!image && !isUploading ? (
                <>
                  <ImageUp size={100} strokeWidth={0.5} />
                  <p className="mb-1 text-sm font-semibold">Upload Image</p>
                  <input
                    type="file"
                    ref={inputImageRef}
                    onChange={handleUploadImage}
                    id="input-image"
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                  />
                </>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    disabled={isUploading}
                    onClick={() => deleteImage(image)}
                  >
                    <Trash2Icon />
                  </Button>
                  <Image
                    src={image}
                    alt="image"
                    width={200}
                    height={200}
                    className="aspect-square rounded-md object-cover transition-all duration-300 ease-in-out"
                  />
                </>
              )}
            </label>
            {message && (
              <div aria-live="polite" aria-atomic="true">
                <span className="error-message">{message}</span>
              </div>
            )}
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
              error={
                state?.error && "role" in state.error ? state.error.role : []
              }
            />
            <FormFieldInput
              name="phone"
              label="Phone Number"
              value={formValues.phone ?? ""}
              setFormValues={setFormValues}
              placeholder="Enter Phone Number"
              type="phone"
              error={
                state?.error && "phone" in state.error ? state.error.phone : []
              }
            />
            <FormFieldInput
              name="address"
              label="Address"
              value={formValues.address ?? ""}
              setFormValues={setFormValues}
              placeholder="Enter Address"
              error={
                state?.error && "address" in state.error
                  ? state.error.address
                  : []
              }
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
            error={
              state?.error && "name" in state.error ? state.error.name : []
            }
          />
          <FormFieldInput
            name="email"
            label="Email"
            value={formValues.email}
            setFormValues={setFormValues}
            placeholder="Enter Email"
            type="email"
            error={
              state?.error && "email" in state.error ? state.error.email : []
            }
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
            error={
              state?.error && "gender" in state.error ? state.error.gender : []
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
              error={
                state?.error && "phone" in state.error ? state.error.phone : []
              }
            />
            <FormFieldInput
              name="address"
              label="Address"
              value={formValues.address ?? ""}
              setFormValues={setFormValues}
              placeholder="Enter Address"
              error={
                state?.error && "address" in state.error
                  ? state.error.address
                  : []
              }
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
              error={
                state?.error && "role" in state.error ? state.error.role : []
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
            error={
              state?.error && "storeId" in state.error
                ? state.error.storeId
                : []
            }
          />
          <FormFieldInput
            name="password"
            label="Password"
            value={formValues.password}
            setFormValues={setFormValues}
            placeholder="Enter Password"
            type="password"
            error={
              state?.error && "password" in state.error
                ? state.error.password
                : []
            }
          />
          <FormFieldInput
            name="confirmPassword"
            label="Confirm Password"
            value={formValues.confirmPassword}
            setFormValues={setFormValues}
            placeholder="Enter Confirm Password"
            type="password"
            error={
              state?.error && "confirmPassword" in state.error
                ? state.error.confirmPassword
                : []
            }
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
