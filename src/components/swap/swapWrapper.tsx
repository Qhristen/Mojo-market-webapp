'use client'

import React, { useEffect, useState } from 'react'
import SelectCoin from './select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowUpDown, Loader2, RefreshCwIcon } from 'lucide-react'
import { Card } from '../ui/card'
import { baseMint, DEFAULT_SWAP_SLIPPAGE } from '@/lib/constant'
import { useGetPools } from '../token/create-token-data-access'
import { useSearchParams } from 'next/navigation'
import { Account, address } from 'gill'
import { Pair } from '@/generated/ts'
import { PairWithMetadata } from '@/types'
import { useSwap } from './swap-data-access'
import { UiWalletAccount, useWalletUi } from '@wallet-ui/react'
import { useGetTokenMetadata } from '../market/market.data.access'
import { Slippage as SlippageComponent } from './slipage'

export default function SwapWrapper({ account }: { account: UiWalletAccount }) {
  const [inputAmount, setInputAmount] = useState<string>('')
  const [slippage, setSlippage] = useState<number>(1)
  const [outputToken, setOutputToken] = useState<PairWithMetadata | undefined>(undefined)
  const searchParams = useSearchParams()
  const from = address(searchParams.get('from') ?? baseMint)
  const to = address(searchParams.get('to') ?? baseMint)
  const swapMutation = useSwap(account)

  const baseToken = useGetTokenMetadata({ address: from })
  const pools = useGetPools()
  const minimum_amount_out = Number(inputAmount) * (1 - slippage)

  useEffect(() => {
    const pairedMintParams = pools.data?.find((p) => p.data.pairedTokenMint === to)
    setOutputToken(pairedMintParams)
  }, [from, to])

  const handleSwap = async () => {
    if (!outputToken?.data.pairedTokenMint) return
    console.log(from, to, minimum_amount_out, inputAmount, 'swap handelr')

    await swapMutation?.mutateAsync({
      inputAmount: Number(inputAmount),
      pairedMint: outputToken.data.pairedTokenMint,
      minOutputAmount: minimum_amount_out,
    })
  }
  return (
    <div className="mx-auto sm:w-[450px] w-[95%] rounded-md bg-card px-10 py-10 mt-5 sm:mb-0 lg:mt-10">
      <div className="flex items-center justify-end pb-2">
        <SlippageComponent slippage={slippage} setSlippage={setSlippage} />
        {/* <Button
          // onClick={refresh}
          // disabled={loadingRoute}
          type="button"
          className=" top-0 text-whit right-2 hover:bg-gray-200 hover:bg-opacity-20"
        >
          <RefreshCwIcon className="h-[20px]" />
        </Button> */}
      </div>

      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between">
          <span className="ml-3 font-bold ">You pay</span>
          {/* <Balance
              tokenAccounts={tokenAccounts}
              token={inputTokenInfo}
              setInput={setInputAmount}
              solBalance={solBalance}
            /> */}
          0.000
        </div>
        <Card className="flex items-center justify-between bg-card border border-input my-2 p-10">
          <Button
            variant={'secondary'}
            className="flex items-center gap-2 border-none focus-visible:outline-0 focus-visible:border-none"
          >
            {baseToken.data ? (
              <>
                <img src={'assets/images/mjlogo.png'} className="h-6 w-6 bg-card rounded-full" alt="token" />
                <span>{baseToken.data.symbol}</span>
              </>
            ) : (
              <>
                <span>Unknown</span>
              </>
            )}
          </Button>
          <Input
            value={inputAmount}
            type="number"
            placeholder="0.000"
            onChange={(e) => setInputAmount(e.target.value.trim())}
            className="w-full p-0 m-0 text-xl border-none bg-transparent font-extrabold text-right md:text-4xl shadow-none dark:bg-transparent focus-visible:outline-0 focus-visible:border-none"
          />
        </Card>

        {/* <div className="flex justify-center items-center my-1">
          <ArrowUpDown
            onClick={() => {
              const temp = inputToken
              setInputToken(outputToken)
              setOutputToken(temp)
            }}
            className="h-[30px] w-[30px]  bg-card rounded-full cursor-pointer"
          />
        </div> */}

        <div className="flex flex-row justify-between mt-10">
          <span className="ml-3 font-bold ">You receive</span>
          {/* <Balance
              tokenAccounts={tokenAccounts}
              token={outputTokenInfo}
              solBalance={solBalance}
            /> */}
          0.000
        </div>
        <Card className="flex items-center justify-between bg-card border border-input my-2 p-10">
          <SelectCoin
            name="output"
            value={outputToken!}
            tokens={pools.data ?? []}
            onSelect={(address) => setOutputToken(address)}
          />
          <div className="text-4xl font-bold text-right bg-transparent">{0}</div>
        </Card>
      </div>
      <Button
        disabled={swapMutation.isPending}
        onClick={handleSwap}
        size={'lg'}
        className="w-full py-8 text-xl font-bold"
        variant={'default'}
      >
        {swapMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Swapping...
          </>
        ) : (
          '  Swap'
        )}
      </Button>
    </div>
  )
}
