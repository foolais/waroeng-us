import ContainerFilterMenu from "@/components/filter/menu/container-filter-menu";
import TableMenu from "@/components/table/content/table-menu";
import TablePagination from "@/components/table/table-pagination";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { getAllMenu } from "@/lib/action/action-menu";
import { MENU_STATUS } from "@prisma/client";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

interface iProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const MenuPage = async ({ searchParams }: iProps) => {
  const { page, search = "", status = "ALL", store = "" } = await searchParams;
  const p = page ? parseInt(page) : 1;

  if (p === 0) return notFound();

  const menuPromise = getAllMenu(
    p,
    search,
    status as "ALL" | MENU_STATUS,
    store,
  );

  return (
    <div>
      <ContainerFilterMenu />
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper menuPromise={menuPromise} page={p} />
      </Suspense>
    </div>
  );
};

const DataTableWrapper = async ({
  menuPromise,
  page,
}: {
  menuPromise: ReturnType<typeof getAllMenu>;
  page: number;
}) => {
  const menus = await menuPromise;

  return (
    <>
      <TableMenu data={menus?.data ?? []} />
      <TablePagination currentPage={page} count={menus?.count ?? 0} />
    </>
  );
};

export default MenuPage;
