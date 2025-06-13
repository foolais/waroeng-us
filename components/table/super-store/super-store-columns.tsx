"use client";

import { formatDate } from "@/lib/utils";
import { Store } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TableActionStore from "./table-actions-store";

export const superStoreColumns: ColumnDef<Store>[] = [
  {
    accessorKey: "no",
    header: "No",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: () => <div className="flex-center">Status</div>,
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return <div className="flex-center mx-auto">{status}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const date = getValue<Date>();
      return formatDate(date);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id, name } = row.original;
      return <TableActionStore id={id} name={name} />;
    },
  },
];
