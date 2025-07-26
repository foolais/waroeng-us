import CartButton from "@/components/button/cart-btn";
import ContainerFilterOrder from "@/components/filter/order/container-filter-order";
import TableOrder from "@/components/table/content/table-order";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllOrder } from "@/lib/action/action-order";
import { ORDER_STATUS } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const CashierOrderPage = async ({ searchParams }: iProps) => {
  const { page, search = "", status = "ALL" } = await searchParams;
  const p = page ? parseInt(page) : 1;

  if (p === 0) return notFound();

  const orderPromise = getAllOrder(p, search, status as "ALL" | ORDER_STATUS);

  return (
    <div className="px-4">
      <div className="flex items-center justify-between">
        <h1 className="header-title">List Pesanan</h1>
        <CartButton />
      </div>
      <ContainerFilterOrder />
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
