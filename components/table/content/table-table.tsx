import Badge from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableStatusBadgeOptions } from "@/lib/data";
import TableActionTable from "../action/table-action-table";
import { TABLE_STATUS } from "@prisma/client";

interface TableTableProps {
  data: {
    no: number;
    id: string;
    name: string;
    status: TABLE_STATUS;
    store: {
      id: string;
      name: string;
    };
  }[];
}

const TableTable = ({ data }: TableTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted font-medium">
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead className="w-1/8">Nama</TableHead>
            <TableHead className="w-[3%] min-w-[80px]">Status</TableHead>
            <TableHead className="w-[20%] min-w-[150px]">Toko</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        {data.length ? (
          data.map((table) => (
            <TableBody key={table.id}>
              <TableRow>
                <TableCell>{table.no}</TableCell>
                <TableCell>{table.name}</TableCell>
                <TableCell>
                  <Badge
                    option={
                      tableStatusBadgeOptions.find(
                        (option) => option.value === table.status,
                      ) ?? tableStatusBadgeOptions[1]
                    }
                  />
                </TableCell>
                <TableCell>{table.store.name}</TableCell>
                <TableCell className="mr-4 flex items-center justify-end">
                  <TableActionTable id={table.id} name={table.name} />
                </TableCell>
              </TableRow>
            </TableBody>
          ))
        ) : (
          <TableCaption className="pb-4">Tidak ada data</TableCaption>
        )}
      </Table>
    </div>
  );
};

export default TableTable;
