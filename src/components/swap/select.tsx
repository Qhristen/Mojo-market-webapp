'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { ArrowDown, ArrowDownToLine, ChevronDown, Link2, LinkIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Account, Address, getExplorerLink } from 'gill'
import { Pair } from '@/generated/ts'
import { useWalletUiCluster } from '@wallet-ui/react'
import { useGetTokenMetadata } from '../market/market.data.access'
import { PairWithMetadata } from '@/types'

export interface ISelectModal {
  name?: 'input' | 'output'
  value: PairWithMetadata
  centered?: boolean
  tokens: PairWithMetadata[]
  onSelect: (pair: PairWithMetadata) => void // address should be type of PublicKey
  className?: string
  hideBalancesInModal?: boolean
  handleAddToken?: (address: string) => void
  sliceName?: boolean
  // commonTokens?: PublicKey[]
  initialHideUnknownTokensValue?: boolean
  onHideUnknownTokensChange?: (val: boolean) => void
  hiddenUnknownTokens?: boolean
  // network: NetworkType
}

export default function SelectCoin({ tokens, onSelect, value }: ISelectModal) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'secondary'}
          className="flex items-center gap-2 border-none focus-visible:outline-0 focus-visible:border-none"
        >
          {value ? (
            <>
              <img src={'assets/images/mjlogo.png'} className="h-6 w-6 bg-card rounded-full" alt="token" />
              <span>{value.pairedTokenMetadata?.symbol}</span>
            </>
          ) : (
            <>
            <span>Select token</span>
          <ChevronDown />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Select token</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-2">
            {tokens.map((token, i) => (
              <Row key={i} token={token} handleSelect={onSelect} setIsDialogOpen={setIsDialogOpen} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const Row = ({
  handleSelect,
  token,
  setIsDialogOpen,
}: {
  handleSelect: (pair: PairWithMetadata) => void
  token: PairWithMetadata
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { cluster } = useWalletUiCluster()
  const pairedTokenInfo = useGetTokenMetadata({ address: token.data.pairedTokenMint })

  return (
    <div className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md p-2">
      <div
        onClick={() => {
          handleSelect(token)

          setIsDialogOpen(false)
        }}
        className="flex flex-row items-center w-full h-full"
      >
        <div>
          <img src={'assets/images/mjlogo.png'} className="h-10 w-10 rounded-full" />
        </div>
        <div className="flex  w-full flex-row items-center justify-between gap-3 ml-3 ">
          <div className="flex items-center gap-2">
            <span className="font-bold text-md ">{pairedTokenInfo.data?.symbol}</span>
            <span className="text-sm opacity-80">{pairedTokenInfo.data?.name}</span>
            <Link
              href={getExplorerLink({
                address: token.address,
                cluster: cluster.cluster,
              })}
            ></Link>
          </div>
          <LinkIcon size={15} />
        </div>
      </div>
    </div>
  )
}
