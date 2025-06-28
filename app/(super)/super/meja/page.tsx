import ContainerFilterTable from "@/components/filter/table/container-filter-table";
import TableTable from "@/components/table/content/table-table";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { Suspense } from "react";

const TablePage = () => {
  return (
    <div>
      <ContainerFilterTable />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async () => {
  return (
    <>
      <TableTable />
    </>
  );
};

export default TablePage;
