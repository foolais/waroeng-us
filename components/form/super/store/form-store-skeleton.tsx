import { Skeleton } from "@/components/ui/skeleton";

const FormStoreSkeleton = () => {
  return (
    <div className="grid w-full items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default FormStoreSkeleton;
