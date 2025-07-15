import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { genderBadgeOptions, roleBadgeOptions } from "@/lib/data";
import { Gender, Role } from "@prisma/client";
import TableActionUser from "../action/table-action-user";

interface UserTableProps {
  data: {
    no: number;
    id: string;
    image: string | null;
    name: string;
    email: string;
    gender: Gender | null;
    store: {
      id: string;
      name: string;
    } | null;
    role: Role;
    created_at: Date;
    updated_at: Date;
  }[];
}

const TableUser = ({ data }: UserTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted font-medium">
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead className="w-[10%]">Gambar</TableHead>
            <TableHead className="hidden w-1/5 md:table-cell">Nama</TableHead>
            <TableHead className="w-1/5">Email</TableHead>
            <TableHead className="hidden w-[7.5%] md:table-cell">
              Jenis Kelamin
            </TableHead>
            <TableHead className="w-1/5">Toko</TableHead>
            <TableHead className="w-[7.5%]">Peran</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        {data.length ? (
          data.map((user) => (
            <TableBody key={user.id}>
              <TableRow>
                <TableCell>{user.no}</TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={user.image ?? ""}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    option={
                      genderBadgeOptions.find(
                        (gender) => gender.value === user.gender,
                      ) ?? genderBadgeOptions[0]
                    }
                  />
                </TableCell>
                <TableCell>{user.store?.name ?? "-"}</TableCell>
                <TableCell>
                  <Badge
                    option={
                      roleBadgeOptions.find(
                        (role) => role.value === user.role,
                      ) ?? roleBadgeOptions[0]
                    }
                  />
                </TableCell>
                <TableCell className="mr-4 flex items-center justify-end">
                  <TableActionUser id={user.id} name={user.name} />;
                </TableCell>
              </TableRow>
            </TableBody>
          ))
        ) : (
          <TableCaption className="pb-4">No Results</TableCaption>
        )}
      </Table>
    </div>
  );
};

export default TableUser;
