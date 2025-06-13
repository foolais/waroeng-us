import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { genderBadgeOptions, roleBadgeOptions } from "@/lib/data";
import { Gender, Role } from "@prisma/client";

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
            <TableHead className="w-[10%]">Image</TableHead>
            <TableHead className="hidden w-1/5 md:table-cell">Name</TableHead>
            <TableHead className="w-1/5">Email</TableHead>
            <TableHead className="hidden w-[7.5%] md:table-cell">
              Gender
            </TableHead>
            <TableHead className="w-1/5">Store</TableHead>
            <TableHead className="w-[7.5%]">Role</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((user) => (
              <TableRow key={user.id}>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No Results</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableUser;
