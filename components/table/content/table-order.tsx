import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import TableActionOrder from "../action/table-action-order";
import { ORDER_STATUS, ORDER_TYPE } from "@prisma/client";
import Badge from "@/components/ui/badge";
import {
  orderStatusBadgeOptions,
  orderTypeBadgeOptions,
  paymentTypeBadgeOptions,
} from "@/lib/data";

interface TableOrderProps {
  data: {
    no: number;
    id: string;
    orderNumber: string;
    status: ORDER_STATUS;
    type: ORDER_TYPE;
    table: {
      name: string;
    } | null;
    total: number;
    transaction: {
      method: "CASH" | "QR";
    } | null;
  }[];
}

const TableOrder = ({ data }: TableOrderProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted font-medium">
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead className="w-[20%]">No Pesanan</TableHead>
            <TableHead className="w-[20%]">Status</TableHead>
            <TableHead className="w-[20%]">Tipe</TableHead>
            <TableHead className="w-[15%]">Meja</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[15%]">Metode</TableHead>
            <TableHead className="w-[5%]"></TableHead>
          </TableRow>
        </TableHeader>
        {data.length ? (
          data.map((order) => (
            <TableBody key={order.id}>
              <TableRow>
                <TableCell>{order.no}</TableCell>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>
                  <Badge
                    option={
                      orderStatusBadgeOptions.find(
                        (option) => option.value === order.status,
                      ) ?? orderStatusBadgeOptions[0]
                    }
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    option={
                      orderTypeBadgeOptions.find(
                        (option) => option.value === order.type,
                      ) ?? orderTypeBadgeOptions[0]
                    }
                  />
                </TableCell>
                <TableCell>{order.table?.name ?? "-"}</TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge
                    option={
                      paymentTypeBadgeOptions.find(
                        (option) => option.value === order.transaction?.method,
                      ) ?? paymentTypeBadgeOptions[0]
                    }
                  />
                </TableCell>
                <TableCell>
                  <TableActionOrder id={order.id} no={order.orderNumber} />
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

export default TableOrder;
