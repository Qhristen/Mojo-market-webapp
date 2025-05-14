'use client'

import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Pair } from '@/generated/ts'
import { Account, Address } from 'gill'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useWalletUi } from '@wallet-ui/react'
import { useGetTokenMetadata } from './market.data.access'
import { PairWithMetadata } from '@/types'

interface PairCellActionProps {
  pair: PairWithMetadata
}

export const PairCellAction: React.FC<PairCellActionProps> = ({ pair }) => {
  const router = useRouter()
  const params = useParams()
  const { client } = useWalletUi()

  return (
    <div className="flex items-center justify-start gap-2">
      <div className="flex items-center justify-start gap-2">
        <img
          className="w-8 h-8 rounded-full"
          src={'assets/images/mjlogo.png'}
          alt="icon"
        />
        <span className="font-bold text-xs">{pair.pairedTokenMetadata?.symbol ?? 'Unknown'}</span>
        <span className="">{pair.pairedTokenMetadata?.name ?? 'Unknown'}</span>
      </div>
      <Copy
        onClick={() => {
          navigator.clipboard.writeText(pair.address)
          toast.success(`Market ID copied.`)
        }}
        size={15}
        className="cursor-pointer"
      />
    </div>
  )
}
