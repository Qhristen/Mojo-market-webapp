"use client"

import { Pair } from "@/generated/ts";
import { ColumnDef } from "@tanstack/react-table";
import { MaybeAccount } from "gill";
import { CellAction } from "./cell-action";


export const columns: ColumnDef<MaybeAccount<Pair>>[] = [
  {
    accessorKey: "pairedSymbol",
    header: "Name",
  },

  {
    accessorKey: "address",
    header: "Pair Address",
  },
 
  {
    accessorKey: "price",
    header: "Price",
  },
 
  {
    accessorKey: "fee",
    header: "Fee",
  },
  {
    accessorKey: "volume",
    header: "Volume",
  },
//   {
//     accessorKey: "tag",
//     header: "Tag",
//   },
 
 
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated At",
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
