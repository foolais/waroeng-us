import { Skeleton } from "../ui/skeleton";

export const FormInputSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export const FormTextAreaSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
};

export const FormImageSkeleton = () => {
  return <Skeleton className="mx-auto h-52 w-52" />;
};
