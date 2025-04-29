"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { TokenPair } from "@/types";


export const columns: ColumnDef<TokenPair>[] = [
  {
    accessorKey: "pairedSymbol",
    header: "Name",
  },

  {
    accessorKey: "pairAddress",
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
