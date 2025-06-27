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
import { storeStatusBadgeOptions } from "@/lib/data";
import TableActionStore from "../action/table-action-store";
import { STORE_STATUS } from "@prisma/client";

interface StoreTableProps {
  data: {
    no: number;
    id: string;
    name: string;
    status: STORE_STATUS;
    created_at: Date;
    updated_at: Date;
    createdById: string;
    updatedById: string | null;
  }[];
}

const TableStore = ({ data }: StoreTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted font-medium">
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead className="min-w-1/4">Name</TableHead>
            <TableHead className="w-[10%] min-w-[150px]">Status</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        {data.length ? (
          data.map((store) => (
            <TableBody key={store.id}>
              <TableRow>
                <TableCell>{store.no}</TableCell>
                <TableCell>{store.name}</TableCell>
                <TableCell>
                  <Badge
                    option={
                      storeStatusBadgeOptions.find(
                        (option) => option.value === store.status,
                      ) ?? storeStatusBadgeOptions[0]
                    }
                  />
                </TableCell>
                <TableCell className="mr-4 flex items-center justify-end">
                  <TableActionStore id={store.id} name={store.name} />;
                </TableCell>
              </TableRow>
            </TableBody>
          ))
        ) : (
          <TableCaption className="mb-4">No Results</TableCaption>
        )}
      </Table>
    </div>
  );
};

export default TableStore;
