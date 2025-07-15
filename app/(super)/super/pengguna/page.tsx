import ContainerFilterUser from "@/components/filter/user/container-filter-user";
import TableUser from "@/components/table/content/table-user";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllUser } from "@/lib/action/action-user";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const SuperUserPage = async ({ searchParams }: iProps) => {
  const { page, search = "", role = "", store = "" } = await searchParams;
  const p = page ? parseInt(page) : 1;

  if (p === 0) return notFound();

  const userPromise = getAllUser(
    p,
    search,
    role as "ALL" | "ADMIN" | "CASHIER",
    store,
  );

  return (
    <div>
      <ContainerFilterUser />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper usersPromise={userPromise} page={p} />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async ({
  usersPromise,
  page,
}: {
  usersPromise: ReturnType<typeof getAllUser>;
  page: number;
}) => {
  const users = await usersPromise;

  return (
    <>
      <TableUser data={users?.data ?? []} />
      <TablePagination currentPage={page} count={users?.count ?? 0} />
    </>
  );
};

export default SuperUserPage;
