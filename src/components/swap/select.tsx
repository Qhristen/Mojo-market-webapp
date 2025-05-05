'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { ArrowDown, ArrowDownToLine, ChevronDown, LinkIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'


export interface ISelectModal {
  name?:  "input" | "output";
  value:string
  current?:string
  centered?: boolean
  tokens: Record<string, string>
  onSelect: (address: string) => void // address should be type of PublicKey
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

export default function SelectCoin({}:ISelectModal) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="flex items-center gap-2 border-none focus-visible:outline-0 focus-visible:border-none">
            {/* <image src="https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png" className="h-[20px] w-[20px] bg-card rounded-md" alt="token" /> */}
            <span>Select token</span>
            <ChevronDown /> 
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Select token</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-2">
            <Row />
            <Row />
            <Row />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const Row = ({ handleSelect }: { handleSelect?: (e: string) => void }) => {
  return (
    <div className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md p-2">
      <div
        //   onClick={() => handleSelect(info)}
        className="flex flex-row items-center w-full h-full"
      >
        <div>
          <img
            //   src={info.logoURI}
            className="h-[35px] w-[35px] rounded-md"
          />
        </div>
        <div className="flex flex-col items-start ml-3 ">
          <span className="font-bold text-md ">CR7</span>
          <span className="text-sm opacity-80">Christiano Ronaldo</span>
        </div>
      </div>
     
    </div>
  )
}
