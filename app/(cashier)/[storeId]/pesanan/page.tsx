import CartButton from "@/components/button/cart-btn";
import TableOrder from "@/components/table/content/table-order";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllOrder } from "@/lib/action/action-order";
import { ORDER_STATUS, ORDER_TYPE } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const CashierOrderPage = async ({ searchParams }: iProps) => {
  const {
    page,
    search = "",
    status = "ALL",
    type = "ALL",
  } = await searchParams;
  const p = page ? parseInt(page) : 1;

  if (p === 0) return notFound();

  const orderPromise = getAllOrder(
    p,
    search,
    status as "ALL" | ORDER_STATUS,
    type as "ALL" | ORDER_TYPE,
  );

  return (
    <div className="px-4">
      <div className="mb-4 flex justify-end">
        <CartButton />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper orderPromise={orderPromise} page={p} />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async ({
  orderPromise,
  page,
}: {
  orderPromise: ReturnType<typeof getAllOrder>;
  page: number;
}) => {
  const orders = await orderPromise;

  return (
    <>
      <TableOrder data={orders?.data ?? []} />
      <TablePagination currentPage={page} count={orders?.count ?? 0} />
    </>
  );
};

export default CashierOrderPage;
