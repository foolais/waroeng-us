import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableCategoryMenu = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead className="w-1/3">Nama Kategori</TableHead>
            <TableHead className="w-1/3">Toko</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>01</TableCell>
            <TableCell>Makanan</TableCell>
            <TableCell>Waroeng Us</TableCell>
            <TableCell className="mr-4 flex items-center justify-end">
              {/* Actions */}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TableCategoryMenu;
