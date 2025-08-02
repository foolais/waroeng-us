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
import TableActionMenu from "../action/table-action-menu";
import Badge from "@/components/ui/badge";
import { menuStatusBadgeOptions } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

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
            <TableHead className="w-[2%]">No</TableHead>
            <TableHead className="w-[4%]">Gambar</TableHead>
            <TableHead className="w-1/8">Nama</TableHead>
            <TableHead className="w-[3%] min-w-[80px]">Harga</TableHead>
            <TableHead className="w-[20%] min-w-[150px]">Toko</TableHead>
            <TableHead className="w-[5%] min-w-[120px]">Status</TableHead>
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
                <TableCell>{formatPrice(menu.price)}</TableCell>
                <TableCell>{menu.store.name}</TableCell>
                <TableCell>
                  <Badge
                    option={
                      menuStatusBadgeOptions.find(
                        (option) => option.value === menu.status,
                      ) ?? menuStatusBadgeOptions[1]
                    }
                  />
                </TableCell>
                <TableCell className="mr-4 flex items-center justify-end">
                  <TableActionMenu id={menu.id} name={menu.name} />
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
