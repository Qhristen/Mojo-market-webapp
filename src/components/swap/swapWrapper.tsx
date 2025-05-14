'use client'

import React, { useEffect, useState } from 'react'
import SelectCoin from '../select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowUpDown, Loader2, RefreshCwIcon } from 'lucide-react'
import { Card } from '../ui/card'
import { baseMint, DEFAULT_SWAP_SLIPPAGE } from '@/lib/constant'
import { useGetPools } from '../token/create-token-data-access'
import { useSearchParams } from 'next/navigation'
import { Account, Address, address, lamports } from 'gill'
import { Pair } from '@/generated/ts'
import { PairWithMetadata } from '@/types'
import { useSwap } from './swap-data-access'
import { UiWalletAccount, useWalletUi } from '@wallet-ui/react'
import { useGetTokenMetadata } from '../market/market.data.access'
import { Slippage as SlippageComponent } from './slipage'
import { calculateExpectedOut } from '@/lib/utils'
import { useGetBalance, useGetTokenAccountBalance } from '../account/account-data-access'

export default function SwapWrapper({ account }: { account: UiWalletAccount }) {
  const [inputAmount, setInputAmount] = useState<string>('')
  const [outputAmount, setOutputAmount] = useState<string>('')
  const [slippageTolerance, setSlippage] = useState<number>(1)
  const [outputToken, setOutputToken] = useState<PairWithMetadata | undefined>(undefined)
  const [inputToken, setInputToken] = useState<PairWithMetadata | undefined>(undefined)
  const searchParams = useSearchParams()
  const from = address(searchParams.get('from') ?? baseMint)
  const to = address(searchParams.get('to') ?? baseMint)
  const swapMutation = useSwap(account)

  const baseToken = useGetTokenMetadata({ address: from })
  const pools = useGetPools()
  const expectedOutPutAmount = calculateExpectedOut(
    Number(inputAmount),
    Number(outputToken?.data.baseReserve ?? 2),
    Number(outputToken?.data.pairedReserve ?? 10),
  )

  const minOutputAmount = Math.floor(expectedOutPutAmount * (1 - slippageTolerance / 100))

  const baseTokenAcc = useGetTokenAccountBalance({ address: inputToken?.data.baseTokenMint as Address, account })
  const pairTokenAcc = useGetTokenAccountBalance({ address: outputToken?.data?.pairedTokenMint as Address, account })

  // Set tokens based on search params and pool data
  useEffect(() => {
    const pairedMintParams = pools.data?.find((p) => p.data.pairedTokenMint === to)
    setOutputToken(pairedMintParams)
  }, [from, to])

  const handleSwap = async () => {
    if (!outputToken?.data.pairedTokenMint) return
    console.log(minOutputAmount, inputAmount, 'swap handelr')

    await swapMutation?.mutateAsync({
      inputAmount: Number(inputAmount),
      pairedMint: outputToken.data.pairedTokenMint,
      minOutputAmount: minOutputAmount,
    })
  }
  return (
    <div className="mx-auto sm:w-[450px] w-[95%] rounded-md bg-card px-10 py-10 mt-5 sm:mb-0 lg:mt-10">
      <div className="flex items-center justify-end pb-2">
        <SlippageComponent slippage={slippageTolerance} setSlippage={setSlippage} />
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
          {`Balance: ${baseTokenAcc.data ? baseTokenAcc.data?.uiAmount : 0}`}
        </div>
        <Card className="grid grid-cols-2 bg-card border border-input my-2 p-10">
          <SelectCoin
            name="input"
            value={inputToken!}
            tokens={[
              {
                address: baseMint,
                executable: false,
                lamports: lamports(BigInt(0)),
                programAddress: baseMint,
                space: BigInt(0),
                data: {
                  discriminator: new Uint8Array([0]),
                  pairedTokenMint: baseMint,
                  lpMint: baseMint,
                  baseReserve: BigInt(0),
                  pairedReserve: BigInt(0),
                  baseTokenMint: baseMint,
                  totalLiquidity: BigInt(0),
                  bump: 0,
                  lastSwapTime: BigInt(0),
                  baseVault: baseMint,
                  pairedVault: baseMint,
                },
                baseTokenMetadata: {
                  name: baseToken.data?.name ?? 'Mojo',
                  symbol: baseToken.data?.symbol ?? 'Mojo',
                },
                pairedTokenMetadata: {
                  name: baseToken.data?.name ?? 'Mojo',
                  symbol: baseToken.data?.symbol ?? 'Mojo',
                },
              },
            ]}
            onSelect={(address) => setInputToken(address)}
          />
          <Input
            value={inputAmount}
            type="number"
            placeholder="0.000"
            onChange={(e) => setInputAmount(e.target.value.trim())}
            className="w-full p-0 m-0 text-xl border-none bg-transparent font-extrabold text-right md:text-4xl shadow-none dark:bg-transparent focus-visible:outline-0 focus-visible:border-none"
          />
        </Card>

        <div className="flex justify-center items-center my-1">
          <ArrowUpDown
            onClick={() => {
              const temp = inputToken
              setInputToken(outputToken)
              setOutputToken(temp)
            }}
            className="h-[30px] w-[30px]  bg-card rounded-full cursor-pointer"
          />
        </div>

        <div className="flex flex-row justify-between">
          <span className="ml-3 font-bold ">You receive</span>
          {/* <Balance
              tokenAccounts={tokenAccounts}
              token={outputTokenInfo}
              solBalance={solBalance}
            /> */}
          {`Balance: ${pairTokenAcc.data ? pairTokenAcc.data?.uiAmount : 0}`}
        </div>
        <Card className="grid grid-cols-2 bg-card border border-input my-2 p-10">
          <SelectCoin
            name="output"
            value={outputToken!}
            tokens={pools.data ?? []}
            onSelect={(address) => setOutputToken(address)}
          />
          <div className="text-4xl font-bold text-right bg-transparent">
            {minOutputAmount > 0 ? minOutputAmount : 0}
          </div>
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
