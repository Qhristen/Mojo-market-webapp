'use client'

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

  return (
    <div>
    
      <Card className="flex itmes-center justify-between py-6 mt-2 bg-transparent  overflow-hidden relative">
        <div className="absolute w-20 h-20 bg-gray-400/20 dark:bg-white/20 rounded-full right-20 top-10 animate-bounce blur-sm" />
        <div className="absolute w-16 h-16 bg-gray-400/20 dark:bg-white/20 rounded-full right-40 bottom-10 animate-bounce delay-300 blur-sm" />
        <div className="absolute w-20 h-20 bg-gray-400/20 dark:bg-white/20 rounded-full left-20 top-10 animate-bounce blur-sm" />
        <div className="absolute w-16 h-16 bg-gray-400/20 dark:bg-white/20 rounded-full left-40 bottom-10 animate-bounce delay-300 blur-sm" />
        <h3 className="text-6xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-jersey15 leading-12 relative z-10">
          Watch the game, <br /> make your next <br /> big trade.
        </h3>
      </Card>

      <DataTable searchKey="name" columns={columns} data={pools.data ?? []} pageCount={0} pageIndex={0} nextPage={0} />
    </div>
  )
}
