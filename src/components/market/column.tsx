'use client'

import { Pair } from '@/generated/ts'
import { ColumnDef } from '@tanstack/react-table'
import { Account, MaybeAccount } from 'gill'
import { CellAction } from './cell-action'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { PairCellAction } from './pair-cell'
import { PairWithMetadata } from '@/types'

export const columns: ColumnDef<PairWithMetadata>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    // filterFn: (row) => Boolean(row.getValue('pairedTokenMetadata.name')),
    cell: ({ row }) => <PairCellAction pair={row.original} />,
  },

  {
    accessorKey: 'price',
    header: 'Price',
  },

  {
    accessorKey: 'fee',
    header: 'Fee',
  },
  {
    accessorKey: 'volume',
    header: 'Volume',
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
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
