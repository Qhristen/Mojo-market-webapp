'use client'

import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Pair } from '@/generated/ts'
import { Account } from 'gill'
import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'

interface CellActionProps {
  data: Account<Pair>
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <Link href={`/swap?from=${data.data.baseTokenMint}&to=${data.data.pairedTokenMint}`}>
      <ArrowLeftRight />
    </Link>
  )
}
