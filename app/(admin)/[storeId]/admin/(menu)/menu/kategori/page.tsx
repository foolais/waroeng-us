import { auth } from "@/auth";
import ContainerFilterCategoryMenu from "@/components/filter/menu/container-filter-category-menu";
import TableCategoryMenu from "@/components/table/content/table-menu-category";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllCategory } from "@/lib/action/action-category";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const AdminCategoryMenuPage = async ({ searchParams }: iProps) => {
  const { page, search = "" } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const session = await auth();

  if (p === 0 || !session || !session.user.storeId) return notFound();

  const categoryPromise = getAllCategory(p, search, session.user.storeId);

  return (
    <div>
      <ContainerFilterCategoryMenu />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper categoryPromise={categoryPromise} page={p} />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async ({
  categoryPromise,
  page,
}: {
  categoryPromise: ReturnType<typeof getAllCategory>;
  page: number;
}) => {
  const categories = await categoryPromise;

  return (
    <>
      <TableCategoryMenu data={categories?.data ?? []} />
      <TablePagination currentPage={page} count={categories?.count ?? 0} />
    </>
  );
};

export default AdminCategoryMenuPage;
