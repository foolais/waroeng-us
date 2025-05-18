import { Skeleton } from "../ui/skeleton";

export const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
};
