'use client'

import { Pair } from '@/generated/ts'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Account, MaybeAccount } from 'gill'
import { CellAction } from './cell-action'
import { ArrowDownRight, ArrowUpRight, Copy, Star } from 'lucide-react'
import { toast } from 'sonner'
import { PairCellAction } from './pair-cell'
import { PairWithMetadata } from '@/types'
import { useMemo } from 'react'

export const columns: ColumnDef<PairWithMetadata>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <PairCellAction pair={row.original} />,
  },

  {
    accessorKey: 'price',
    header: 'Price (MOJO)',
  },

  {
    accessorKey: 'priceChange24h',
    header: '24h Change',
  },
  {
    accessorKey: 'volume',
    header: 'Volume',
  },
  {
    accessorKey: 'volume24h',
    header: '24h Volume',
  },

  {
    accessorKey: 'liquidity',
    header: 'Liquidity',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]

// Column definition for Tanstack Table
// const columnHelper = createColumnHelper<PairWithMetadata>();
// export const columns =  [
//   columnHelper.accessor('address', {
//     header: '',
//     cell: ({ row }) => (
//       <button className={`hover:text-yellow-500 ${row.original.address ? 'text-yellow-500' : 'text-gray-500'}`}>
//         <Star size={16} />
//       </button>
//     ),
//     enableSorting: false,
//   }),
//   columnHelper.accessor('pairedTokenMetadata.name', {
//     header: 'Pair',
//     cell: ({ row }) => (
//       <div className="flex items-center">
//         <div className="bg-primary-mojo h-6 w-6 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
//           {row.original.pairedTokenMetadata?.name?.substring(0, 1) || '?'}
//         </div>
//         <span>{row.original.pairedTokenMetadata?.name || ''}</span>
//       </div>
//     ),
//   }),
//   columnHelper.accessor('price', {
//     header: 'Price (MOJO)',
//     // cell: ({ getValue }) => `${getValue().toFixed(4)}`,
//   }),
//   columnHelper.accessor('priceChange24h', {
//     header: '24h Change',
//     // cell: ({ getValue }) => {
//     //   const value = getValue() as number;
//     //   return (
//     //     <div className={`flex items-center ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//     //       {value >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
//     //       <span>{Math.abs(value).toFixed(2)}%</span>
//     //     </div>
//     //   );
//     // },
//   }),
//   columnHelper.accessor('volume24h', {
//     header: '24h Volume',
//     // cell: ({ getValue }) => `$${getValue().toLocaleString()}`,
//   }),
//   columnHelper.accessor('liquidity', {
//     header: 'Liquidity',
//     // cell: ({ getValue }) => `$${getValue().toLocaleString()}`,
//   })

// ];
