import { Suspense } from "react";
import ContainerFilterStore from "@/components/filter/store/container-filter-store";
import { getAllStore } from "@/lib/action/action-store";
import { STORE_STATUS } from "@prisma/client";
import { notFound } from "next/navigation";
import { TableSkeleton } from "@/components/table/table-skeleton";
import TablePagination from "@/components/table/table-pagination";
import TableStore from "@/components/table/content/table-store";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const SuperStorePage = async ({ searchParams }: iProps) => {
  const { page, search = "", status = "ALL" } = await searchParams;
  const p = page ? parseInt(page) : 1;

  if (p === 0) return notFound();

  const storePromise = getAllStore(p, search, status as STORE_STATUS);

  return (
    <div>
      <ContainerFilterStore />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper storesPromise={storePromise} page={p} />
      </Suspense>
    </div>
  );
};

async function DataTableWrapper({
  storesPromise,
  page,
}: {
  storesPromise: ReturnType<typeof getAllStore>;
  page: number;
}) {
  const stores = await storesPromise;

  return (
    <>
      <TableStore data={stores?.data ?? []} />
      <TablePagination currentPage={page} count={stores?.count ?? 0} />
    </>
  );
}

export default SuperStorePage;
