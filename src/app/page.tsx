import { Market } from '@/components/market'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense>
      <Market />
    </Suspense>
  )
}
