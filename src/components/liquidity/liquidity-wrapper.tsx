'use client'

import { useState } from 'react'
import { ArrowLeftRight, Info, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import SelectCoin from '../select'
import { PairWithMetadata } from '@/types'
import { useGetPools } from '../token/create-token-data-access'
import { useGetTokenMetadata } from '../market/market.data.access'
import { baseMint } from '@/lib/constant'
import { useGetTokenAccountBalance } from '../account/account-data-access'
import { Address } from 'gill'
import { UiWalletAccount } from '@wallet-ui/react'

export default function LiquidityWrapper({ account }: { account: UiWalletAccount }) {
  const pools = useGetPools()
  const [activeTab, setActiveTab] = useState('concentration')
  const [outputToken, setOutputToken] = useState<PairWithMetadata | undefined>(undefined)
  const baseToken = useGetTokenMetadata({ address: baseMint })

  const [selectedTVL, setSelectedTVL] = useState('0.01%')
  const [rangeValue, setRangeValue] = useState(34)

  const baseTokenAcc = useGetTokenAccountBalance({ address: baseMint, account })
  const pairTokenAcc = useGetTokenAccountBalance({ address: outputToken?.data?.pairedTokenMint as Address, account })

  const tvlOptions = [
    { percent: '0.01%', tvl: '53%', value: '$7.98K' },
    { percent: '0.02%', tvl: '3%', value: '$401.03' },
    { percent: '0.05%', tvl: '43%', value: '$6.45K' },
    { percent: '0.1%', tvl: '1%', value: '$172.10' },
    { percent: '0.2%', tvl: '0%', value: '$0.00' },
  ]

  return (
    <div className="pt-4">
      <div className="mx-auto sm:w-[550px] w-[95%]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-jersey25">Add new position</h1>
          <div className="flex items-center">
            <button className="ml-4 ">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="">
          {/* Left Column */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl mb-6">Tokens</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full mr-2">
                <Button
                  variant={'secondary'}
                  disabled={true}
                  className="flex w-full items-center justify-start gap-2 border-none focus-visible:outline-0 focus-visible:border-none"
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
              </div>

              <div className="flex items-center justify-center mx-2">
                <ArrowLeftRight className="text-gray-500" size={20} />
              </div>

              <div className="relative w-full ml-2">
                <div className="rounded-lg flex items-center p-2">
                  <SelectCoin
                    name="output"
                    value={outputToken!}
                    tokens={pools?.data ?? []}
                    onSelect={(address) => setOutputToken(address)}
                  />
                </div>
              </div>
            </div>

            {/* TVL Selection */}
            {/* <div className="grid grid-cols-5 gap-1 mb-8">
              {tvlOptions.map((option) => (
                <div
                  key={option.percent}
                  onClick={() => setSelectedTVL(option.percent)}
                  className={`
                    text-center py-3 px-1 rounded cursor-pointer
                    ${option.percent === selectedTVL ? 'border-2 border-green-500 bg-gray-700' : 'bg-gray-900'}
                  `}
                >
                  <div className="text-xs text-gray-400">TVL {option.tvl}</div>
                  <div className="text-lg font-bold">{option.percent}</div>
                  <div className="text-sm">{option.value}</div>
                </div>
              ))}
            </div> */}

            <h2 className="text-xl mb-6">Deposit Amount</h2>

            {/* Base Input */}
            <div className="mb-4">
              <div className="rounded-lg p-3 flex items-center">
                <div className="flex items-center">
                  <div className=" h-6 w-6 rounded-full flex items-center justify-center mr-2">
                    <img src={'assets/images/mjlogo.png'} className="h-6 w-6 bg-card rounded-full" alt="token" />
                  </div>
                  <span className="mr-4">{baseToken.data?.symbol}</span>
                </div>
                <Input
                  type="text"
                  value="0.0"
                  className="w-full p-0 m-0 text-xl border-none bg-transparent font-extrabold text-right md:text-4xl shadow-none dark:bg-transparent focus-visible:outline-0 focus-visible:border-none"

                  // disabled={true}
                />
              </div>
              <div className="flex justify-between items-center text-sm mt-1 text-gray-400">
                <div>
                  {' '}
                  {`Balance: ${baseTokenAcc.data ? baseTokenAcc.data?.uiAmount : 0} ${baseToken.data?.symbol}`}
                </div>
                {/* <div className="flex gap-1">
                  <Button className="bg-green-500  px-2 py-1 rounded text-xs">Max</Button>
                  <Button className="bg-purple-500  px-2 py-1 rounded text-xs">50%</Button>
                  <div>~$0</div>
                </div> */}
              </div>
            </div>

            {/* SPL Input */}
            <div className="mb-6">
              <div className="rounded-lg p-3 flex items-center">
                <div className="flex items-center">
                  <div className="bg-blue-400 h-6 w-6 rounded-full flex items-center justify-centercr mr-2">
                  <img src={'assets/images/mjlogo.png'} className="h-6 w-6 bg-card rounded-full" alt="token" />
                  </div>
                  <span className="mr-4">{outputToken?.pairedTokenMetadata?.symbol ?? ""}</span>
                </div>
                <Input
                  type="text"
                  value="0.0"
                  className="w-full p-0 m-0 text-xl border-none bg-transparent font-extrabold text-right md:text-4xl shadow-none dark:bg-transparent focus-visible:outline-0 focus-visible:border-none"
                />
              </div>
              <div className="flex justify-between items-center text-sm mt-1 text-gray-400">
                <div>
                  {' '}
                  {`Balance: ${pairTokenAcc.data ? pairTokenAcc.data?.uiAmount : 0} ${outputToken?.pairedTokenMetadata?.symbol}`}
                </div>
                {/* <div className="flex gap-1">
                  <Button className="bg-green-500  px-2 py-1 rounded text-xs">Max</Button>
                  <Button className="bg-purple-500  px-2 py-1 rounded text-xs">50%</Button>
                  <div>~$0</div>
                </div> */}
              </div>
            </div>

            {/* Action Button */}
            <Button className="w-full font-medium">Add liquidity</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
