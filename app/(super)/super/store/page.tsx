import { DataTable } from "@/components/table/data-table";
import React from "react";
import { superStoreColumns } from "@/components/table/super-store/super-store-columns";
import FilterSuperStore from "@/components/form/filter/super/filter-super-store";

const dummy = [
  {
    no: 1,
    id: "ajsdfakdghka",
    name: "Store 1",
    status: "ACTIVE" as const,
    created_at: new Date(),
    updated_at: new Date(),
    createdById: "ajsdfakdghka",
    updatedById: "ajsdfakdghka",
  },
  {
    no: 2,
    id: "ashfjkajsahfkja",
    name: "Store 2",
    status: "INACTIVE" as const,
    created_at: new Date(),
    updated_at: new Date(),
    createdById: "ajsdfakdghka",
    updatedById: "ajsdfakdghka",
  },
];

const SuperStorePage = () => {
  return (
    <div>
      <FilterSuperStore />
      <DataTable columns={superStoreColumns} data={dummy} />
    </div>
  );
};

export default SuperStorePage;
