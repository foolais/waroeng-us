import { auth } from "@/auth";
import ContainerFilterTable from "@/components/filter/table/container-filter-table";
import TableTable from "@/components/table/content/table-table";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllTable } from "@/lib/action/action-table";
import { TABLE_STATUS } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const AdminTablePage = async ({ searchParams }: iProps) => {
  const { page, search = "", status = "ALL" } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const session = await auth();

  if (p === 0 || !session || !session.user.storeId) return notFound();

  const tablePromise = getAllTable(
    p,
    search,
    status as "ALL" | TABLE_STATUS,
    session.user.storeId,
  );

  return (
    <div>
      <ContainerFilterTable />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper tablePromise={tablePromise} page={p} />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async ({
  tablePromise,
  page,
}: {
  tablePromise: ReturnType<typeof getAllTable>;
  page: number;
}) => {
  const tables = await tablePromise;

  return (
    <>
      <TableTable data={tables?.data ?? []} />
      <TablePagination currentPage={page} count={tables?.count ?? 0} />
    </>
  );
};

export default AdminTablePage;
