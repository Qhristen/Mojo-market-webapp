'use client'

import React, { useState } from 'react'
import SelectCoin from './select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowUpDown, RefreshCwIcon } from 'lucide-react'
import { Card } from '../ui/card'

export default function Swap() {
  const [inputAmount, setInputAmount] = useState<string>('')
  const [inputToken, setInputToken] = useState<string>('')
  const [outputToken, setOutputToken] = useState<string>('')

  return (
    <div className="mx-auto sm:w-[450px] w-[95%] rounded-md bg-card px-10 py-10 mt-5 sm:mb-0 lg:mt-10">
      <div className="">
        {/* <Slippage slippage={slippage} setSlippage={setSlippage} /> */}
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
          <span className="ml-3 font-bold text-white">You pay</span>
          {/* <Balance
              tokenAccounts={tokenAccounts}
              token={inputTokenInfo}
              setInput={setInputAmount}
              solBalance={solBalance}
            /> */}
          0.000
        </div>
        <Card className="flex items-center justify-between bg-card border my-2 p-10">
          <SelectCoin  value={inputToken} name="input" tokens={{}} onSelect={(address) => setInputToken(address)} />
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
          <span className="ml-3 font-bold text-white">You receive</span>
          {/* <Balance
              tokenAccounts={tokenAccounts}
              token={outputTokenInfo}
              solBalance={solBalance}
            /> */}
          0.000
        </div>
        <Card className="flex items-center justify-between bg-card border my-2 p-10">
          <SelectCoin name="output"  value={outputToken} tokens={{}} onSelect={(address) => setOutputToken(address)} />
          <div className="text-4xl font-bold text-right bg-transparent">{outputToken ?? 0}</div>
        </Card>
      </div>
    </div>
  )
}
