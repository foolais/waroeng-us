import { FormImageSkeleton, FormInputSkeleton } from "../form-skeleton";

const FormMenuSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-4">
      <div className="flex flex-col gap-6">
        <FormImageSkeleton />
        <div className="hidden w-full items-center gap-4 md:grid">
          <FormInputSkeleton /> {/* Toko */}
        </div>
      </div>
      <div className="grid w-full items-center gap-4">
        <FormInputSkeleton /> {/* Nama */}
        <FormInputSkeleton /> {/* Harga */}
        <FormInputSkeleton /> {/* Status */}
        <FormInputSkeleton /> {/* Kategori */}
        <div className="md:hidden">
          <FormInputSkeleton /> {/* Toko */}
        </div>
      </div>
    </div>
  );
};

export default FormMenuSkeleton;
