'use client'

import { useWalletUi } from '@wallet-ui/react'
import React from 'react'
import SwapWrapper from './swapWrapper'
import { WalletButton } from '../solana/solana-provider'
import NotConnected from '../not-connected'

export default function Swap() {
  const { account } = useWalletUi()
  return (
    <div>
        {account ? (
          <SwapWrapper account={account} />
        ) : <NotConnected />}
    </div>
  )
}
