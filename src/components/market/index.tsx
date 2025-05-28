'use client'

import { useGetPools } from '../token/create-token-data-access'
import { Card } from '../ui/card'
import { DataTable } from '../ui/data-table'
import { ChartComponent } from './chart'
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

  return (
    <div>
      <ChartComponent  />
      <Card className='mt-10 p-4'>
        <DataTable columns={columns} data={pools.data ?? []} pageCount={0} pageIndex={0} nextPage={0} />
      </Card>
    </div>
  )
}
