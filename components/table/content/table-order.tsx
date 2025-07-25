import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import TableActionOrder from "../action/table-action-order";
// import { ORDER_STATUS } from "@prisma/client";

// interface TableOrderProps {
//   data: {
//     no: number;
//     id: string;
//     status: ORDER_STATUS;
//     tableId: string;
//     total: number;
//   };
// }

const TableOrder = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted font-medium">
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Meja</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[5%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>Makan Ditempat</TableCell>
            <TableCell>Meja 1</TableCell>
            <TableCell>{formatPrice(10000)}</TableCell>
            <TableCell>
              <TableActionOrder id="1" no="1" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TableOrder;
