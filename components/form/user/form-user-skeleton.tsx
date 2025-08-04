import { FormImageSkeleton, FormInputSkeleton } from "../form-skeleton";

const FormUserSkeleton = ({
  type,
}: {
  type: "CREATE" | "UPDATE" | "DETAIL";
}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-4">
      <div className="flex flex-col gap-6">
        <FormImageSkeleton />
        <div className="hidden w-full items-center gap-4 md:grid">
          {type === "CREATE" && <FormInputSkeleton />} {/* Peran */}
          <FormInputSkeleton /> {/* No Telepon */}
          <FormInputSkeleton /> {/* Alamat */}
        </div>
      </div>
      <div className="grid w-full items-center gap-4">
        <FormInputSkeleton /> {/* Nama */}
        <FormInputSkeleton /> {/* Email */}
        <FormInputSkeleton /> {/* Jenis Kelamin */}
        <div className="grid w-full items-center gap-4 md:hidden">
          <FormInputSkeleton /> {/* No Telepon */}
          <FormInputSkeleton /> {/* Alamat */}
          <FormInputSkeleton /> {/* Peran */}
        </div>
        <FormInputSkeleton /> {/* Toko */}
        {type !== "CREATE" && <FormInputSkeleton />} {/* Peran */}
        {type === "CREATE" && (
          <>
            <FormInputSkeleton /> {/* Password */}
            <FormInputSkeleton /> {/*  Konfirmasi Password */}
          </>
        )}
      </div>
    </div>
  );
};

export default FormUserSkeleton;
