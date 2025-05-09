
'use client'

import { useWalletUi } from '@wallet-ui/react'
import React from 'react'
import LiquidityWrapper from './liquidity-wrapper'
import NotConnected from '../not-connected'

export default function Liquidity() {
     const { account } = useWalletUi()
  return (
    <div>
       { account ? <LiquidityWrapper account={account} /> : <NotConnected />}
    </div>
  )
}
