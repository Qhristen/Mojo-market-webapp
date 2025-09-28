'use client'

import { install } from '@solana/webcrypto-ed25519-polyfill'
install() // This adds Ed25519 support to the Web Crypto API

import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from './react-query-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import React from 'react'
import { ReduxProviders } from '@/redux/provider'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReduxProviders>
      <ReactQueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SolanaProvider>{children}</SolanaProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </ReduxProviders>
  )
}
