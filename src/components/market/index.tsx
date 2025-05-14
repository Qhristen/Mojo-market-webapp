'use client'

import { useMemo } from 'react'
import { useGetPools } from '../token/create-token-data-access'
import { Card } from '../ui/card'
import { DataTable } from '../ui/data-table'
import Chart from './chart'
import { columns } from './column'
import { ColumnDef } from '@tanstack/react-table'
import { PairWithMetadata } from '@/types'

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
      {/* <Card className="flex itmes-center justify-between py-6 mt-2 bg-transparent  overflow-hidden relative">
      <Card>
        
        </Card>
      </Card> */}
      <Chart />
      <Card className='mt-10 p-4'>
        <DataTable columns={columns} data={pools.data ?? []} pageCount={0} pageIndex={0} nextPage={0} />
      </Card>
    </div>
  )
}
