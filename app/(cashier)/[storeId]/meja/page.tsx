import { auth } from "@/auth";
import CartButton from "@/components/button/cart-btn";
import ContainerTableCard from "@/components/card/container-table-card";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllTable } from "@/lib/action/action-table";
import { TABLE_STATUS } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const CashierOrderPage = async ({ searchParams }: iProps) => {
  const { search = "", status = "ALL" } = await searchParams;
  const session = await auth();

  if (!session || !session.user.storeId) return notFound();

  const tablePromise = getAllTable(
    1,
    search,
    status as "ALL" | TABLE_STATUS,
    session.user.storeId,
    true,
  );

  return (
    <div className="px-4">
      <div className="flex items-center justify-between">
        <h1 className="header-title">List Meja</h1>
        <CartButton />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper tablePromise={tablePromise} />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async ({
  tablePromise,
}: {
  tablePromise: ReturnType<typeof getAllTable>;
}) => {
  const tables = await tablePromise;

  return (
    <>
      <ContainerTableCard data={tables?.data ?? []} />
    </>
  );
};

export default CashierOrderPage;
