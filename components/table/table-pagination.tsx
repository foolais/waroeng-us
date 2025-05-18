"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ITEM_PER_PAGE } from "@/lib/data";
import { useRouter } from "next/navigation";

const TablePagination = ({
  currentPage,
  count,
}: {
  currentPage: number;
  count: number;
}) => {
  const router = useRouter();
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const totalPage = Math.ceil(count / ITEM_PER_PAGE);

  return (
    <div className="mt-4 flex items-center">
      <div className="flex w-[100px] text-sm font-medium">
        Page {currentPage} of {totalPage}
      </div>
      <Pagination className="justify-end">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              aria-label="Go to previous page"
              aria-disabled={currentPage === 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={() => changePage(currentPage - 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 1}>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              aria-label="Go to next page"
              onClick={() => changePage(currentPage + 1)}
              aria-disabled={currentPage === totalPage}
              tabIndex={currentPage >= totalPage ? -1 : undefined}
              className={
                currentPage >= totalPage
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
