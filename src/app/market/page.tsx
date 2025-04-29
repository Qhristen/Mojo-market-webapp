import { Market } from '@/components/market'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense>
      <Market />
    </Suspense>
  )
}
