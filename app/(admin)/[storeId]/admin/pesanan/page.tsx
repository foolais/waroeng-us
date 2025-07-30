import ContainerFilterOrder from "@/components/filter/order/container-filter-order";
import TableOrder from "@/components/table/content/table-order";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllOrder } from "@/lib/action/action-order";
import { ORDER_STATUS } from "@prisma/client";
import moment from "moment";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const AdminOrderPage = async ({ searchParams }: iProps) => {
  const {
    page,
    search = "",
    status = "ALL",
    dateFrom = "",
    dateTo = "",
  } = await searchParams;

  const p = page ? parseInt(page) : 1;
  if (p === 0) return notFound();

  const orderPromise = getAllOrder(
    p,
    search,
    status as "ALL" | ORDER_STATUS,
    dateFrom
      ? moment(dateFrom, "DD-MM-YYYY").startOf("day").toISOString()
      : null,
    dateTo ? moment(dateTo, "DD-MM-YYYY").endOf("day").toISOString() : null,
  );

  return (
    <div>
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

export default AdminOrderPage;
