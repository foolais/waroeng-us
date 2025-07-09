import ContainerFilterCategoryMenu from "@/components/filter/menu/container-filter-category-menu";
import TableCategoryMenu from "@/components/table/content/table-menu-category";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { Suspense } from "react";

const CategoryMenuPage = () => {
  return (
    <div>
      <ContainerFilterCategoryMenu />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async () => {
  return (
    <>
      <TableCategoryMenu />
      <TablePagination currentPage={1} count={0} />
    </>
  );
};

export default CategoryMenuPage;
