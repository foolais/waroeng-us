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
import { MENU_STATUS } from "@prisma/client";

interface TableMenuProps {
  data: {
    no: number;
    id: string;
    name: string;
    image: string | null;
    price: number;
    status: MENU_STATUS;
    store: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
    };
  }[];
}

const TableMenu = ({ data }: TableMenuProps) => {
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
        {data.length ? (
          data.map((menu) => (
            <TableBody key={menu.id}>
              <TableRow>
                <TableCell>{menu.no}</TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={menu.image ?? ""}
                      alt={menu.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {menu.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{menu.name}</TableCell>
                <TableCell>{menu.price}</TableCell>
                <TableCell>{menu.store.name}</TableCell>
                <TableCell className="mr-4 flex items-center justify-end">
                  {/* Actions */}
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

export default TableMenu;
