"use client";

import { iFromUser } from "@/types/types";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { FormFieldCombobox, FormFieldInput } from "../form-field";
import { ImageUp, Loader2, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createUser } from "@/lib/action/action-user";
import { type PutBlobResult } from "@vercel/blob";
import Image from "next/image";
import { useUserImage } from "@/store/user/useUserFilter";
import { genderOptions, roleOptions } from "@/lib/data";
import { getAllStore } from "@/lib/action/action-store";
import { toast } from "sonner";
import { debounce } from "lodash";

const FormCreateUser = ({ onCloseDialog }: { onCloseDialog: () => void }) => {
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
  const [storeValue, setStoreValue] = useState("");
  const [storesData, setStoresData] = useState<
    { value: string; label: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setUrl } = useUserImage();

  const hasRun = useRef(false);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(
    createUser.bind(null, image),
    null,
  );

  // Memoized debounced fetch function
  const debouncedFetchTools = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          setIsSearching(true);
          const { data } = await getAllStore(
            1,
            encodeURIComponent(query),
            "ACTIVE",
          );

          const mappedData = Array.isArray(data)
            ? data.map((tool) => ({
                value: tool.id,
                label: tool.name,
              }))
            : [];

          setStoresData(mappedData);
        } catch (error) {
          console.error("Search error:", error);
          toast.error(
            `Failed to search tools: ${error instanceof Error ? error.message : String(error)}`,
          );
          setStoresData([]);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    [],
  );

  // Handle search query changes
  const handleSearch = (query: string) => {
    if (query.trim()) {
      debouncedFetchTools(query);
    }
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchTools.cancel();
    };
  }, [debouncedFetchTools]);

  // Initial data load
  useEffect(() => {
    debouncedFetchTools("");
  }, [debouncedFetchTools]);

  //toast when success create user
  useEffect(() => {
    if (!hasRun.current && state?.success && state?.message) {
      toast.success(state.message, { duration: 1500 });
      onCloseDialog();
      hasRun.current = true;
    }
  }, [state, onCloseDialog]);

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
        toast.error(`Failed to upload image`);
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
              htmlFor="image"
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
                    id="image"
                    name="image"
                    type="file"
                    ref={inputImageRef}
                    onChange={handleUploadImage}
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
            isLoadingQuery={isSearching}
            widthClassName="w-full"
            data={storesData}
            value={storeValue}
            setValue={setStoreValue}
            isQuerySearch
            onSearch={handleSearch}
            onChangeForm={(val) =>
              setFormValues((prev) => ({
                ...prev,
                storeId: val as "ADMIN" | "CASHIER",
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
