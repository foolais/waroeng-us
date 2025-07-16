import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableActionCategory from "../action/table-action-category";

interface TableCategoryMenuProps {
  data: {
    no: number;
    id: string;
    name: string;
    store: {
      id: string;
      name: string;
    };
    created_at: Date;
    updated_at: Date;
  }[];
}

const TableCategoryMenu = ({ data }: TableCategoryMenuProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[2%]">No</TableHead>
            <TableHead className="w-1/3">Nama Kategori</TableHead>
            <TableHead className="w-1/3">Toko</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        {data.length ? (
          data.map((category) => (
            <TableBody key={category.id}>
              <TableRow>
                <TableCell>{category.no}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.store.name}</TableCell>
                <TableCell className="mr-4 flex items-center justify-end">
                  <TableActionCategory id={category.id} name={category.name} />
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

export default TableCategoryMenu;
