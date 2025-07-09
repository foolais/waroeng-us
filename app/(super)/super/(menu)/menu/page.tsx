import ContainerFilterMenu from "@/components/filter/menu/container-filter-menu";
import TableMenu from "@/components/table/content/table-menu";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import React, { Suspense } from "react";

const MenuPage = () => {
  return (
    <div>
      <ContainerFilterMenu />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async () => {
  return (
    <>
      <TableMenu />
      <TablePagination currentPage={1} count={0} />
    </>
  );
};

export default MenuPage;
