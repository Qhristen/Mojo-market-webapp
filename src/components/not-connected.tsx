import React from 'react'
import { WalletButton } from './solana/solana-provider'

export default function NotConnected() {
  return (
    <div className="flex items-center justify-center w-full h-[70vh] ">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-4xl font-jersey25 py-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Wallet is not connected
                  </h3>
                  <WalletButton size="md" />
                </div>
              </div>
  )
}
