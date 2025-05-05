"use client" 

import { useGetPools } from '../token/create-token-data-access'
import { Card } from '../ui/card'
import { DataTable } from '../ui/data-table'
import { columns } from './column'

interface Props {
  page: number
  limit: number
}

export function Market() {
  const pools = useGetPools()
 
  if (pools.isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }


  console.log(pools.data, 'pairs')

  return (
    <div>
      <Card className="flex itmes-center justify-between p-6 mt-2 bg-primary-mojo">
        <h3 className="text-4xl font-jersey15 text-white leading-7">
          Watch the game, <br /> track the stats & make <br /> your next big trade.
        </h3>
      </Card>

      <DataTable
        searchKey="pairedSymbol"
        columns={columns}
        data={pools.data ?? []}
        pageCount={0}
        pageIndex={0}
        nextPage={0}
      />
    </div>
  )
}
