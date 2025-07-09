import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableMenu = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead className="w-1/8">Gambar</TableHead>
            <TableHead className="w-1/8">Nama</TableHead>
            <TableHead className="w-[3%] min-w-[80px]">Harga</TableHead>
            <TableHead className="w-[20%] min-w-[150px]">Toko</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>01</TableCell>
            <TableCell>
              <Avatar>
                <AvatarImage
                  src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                  alt="Soto Ayam"
                  className="object-cover"
                />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>Soto Ayam</TableCell>
            <TableCell>Rp 15.000</TableCell>
            <TableCell>Waroeng Us</TableCell>
            <TableCell className="mr-4 flex items-center justify-end">
              {/* Actions */}
            </TableCell>
          </TableRow>
        </TableBody>
        <TableCaption className="pb-4">Tidak ada data</TableCaption>
      </Table>
    </div>
  );
};

export default TableMenu;
