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

const TableTable = () => {
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
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>01</TableCell>
            <TableCell>
              <Badge
                option={
                  tableStatusBadgeOptions.find(
                    (option) => option.value === "active",
                  ) ?? tableStatusBadgeOptions[1]
                }
              />
            </TableCell>
            <TableCell>Waroeng Us</TableCell>
            {/* Actions */}
            <TableCell className="mr-4 flex items-center justify-end">
              <TableActionTable id="01" name="01" />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableCaption className="pb-4">Tidak ada data</TableCaption>
      </Table>
    </div>
  );
};

export default TableTable;
