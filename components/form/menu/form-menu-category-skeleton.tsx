import { FormInputSkeleton } from "../form-skeleton";

const FormMenuCategorySkeleton = () => {
  return (
    <div className="grid w-full items-center gap-4">
      <FormInputSkeleton /> {/* Nama */}
      <FormInputSkeleton /> {/* Toko */}
    </div>
  );
};

export default FormMenuCategorySkeleton;
