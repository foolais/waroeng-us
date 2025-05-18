import { useMemo } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface iFormFieldInputProps<T>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string[];
  value: string;
  setFormValues?: React.Dispatch<React.SetStateAction<T>>;
}

export const FormFieldInput = <T,>({
  name,
  label,
  error,
  value,
  setFormValues,
  ...rest
}: iFormFieldInputProps<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues?.((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const errorMessage = useMemo(() => error?.join(" & "), [error]);

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name as string}>{label}</Label>
      <Input
        id={name as string}
        name={name as string}
        value={value}
        onChange={handleChange}
        {...rest}
      />
      {errorMessage && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-1 text-sm text-red-600"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};
