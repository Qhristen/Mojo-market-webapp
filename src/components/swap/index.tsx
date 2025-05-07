'use client'

import { useWalletUi } from '@wallet-ui/react'
import React from 'react'
import SwapWrapper from './swapWrapper'
import { WalletButton } from '../solana/solana-provider'

export default function Swap() {
  const { account } = useWalletUi()
  return (
    <div>
      <div className="absolute w-96 h-100 bg-gradient-to-b from-bg-gray-400/20 to-bg-transparent dark:bg-blue-600/20 rounded-full right-60 top-10 blur-3xl" />
      <div className="absolute w-100 h-100 bg-gradient-to-b from-bg-gray-400/20 to-bg-transparent dark:bg-blue-600/20 rounded-full left-60 bottom-10 blur-3xl" />
      <div className="z-20">
        {account ? (
          <SwapWrapper account={account} />
        ) : (
          <div className="flex items-center justify-center w-full h-[70vh] ">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-4xl font-jersey25 py-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Wallet is not connected
              </h3>
              <WalletButton size="md" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
