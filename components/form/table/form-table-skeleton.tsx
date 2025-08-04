import { FormInputSkeleton } from "../form-skeleton";

const FormTableSkeleton = () => {
  return (
    <div className="grid w-full items-center gap-4">
      <FormInputSkeleton /> {/* Nama*/}
      <FormInputSkeleton /> {/* Toko */}
      <FormInputSkeleton /> {/* Status */}
    </div>
  );
};

export default FormTableSkeleton;
