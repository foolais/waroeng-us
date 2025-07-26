import CartButton from "@/components/button/cart-btn";
import TableOrder from "@/components/table/content/table-order";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { Suspense } from "react";

const CashierOrderPage = () => {
  return (
    <div className="px-4">
      <div className="mb-4 flex justify-end">
        <CartButton />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = () => {
  return (
    <>
      <TableOrder />
    </>
  );
};

export default CashierOrderPage;
