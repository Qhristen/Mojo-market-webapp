import { Market } from '@/components/market'
import Stats from '@/components/stats'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense>
      <Stats />
    </Suspense>
  )
}
