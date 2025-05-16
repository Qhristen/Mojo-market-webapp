import { AppLayout } from '@/components/app-layout'
import { AppProviders } from '@/components/app-providers'
import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mojo markets',
  description: 'Web3',
}

const links: { label: string; path: string }[] = [
  // More links...
  { label: 'Market', path: '/' },
  { label: 'Swap', path: '/swap' },
  { label: 'Liquidity', path: '/liquidity' },
  // { label: 'Stake', path: '/stake' },
  { label: 'Athlete stats', path: '/stats' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased relative`}>
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute z-0 w-96 h-100 bg-gradient-to-b from-bg-gray-400/20 to-bg-transparent dark:bg-blue-600/20 rounded-full right-60 top-10 blur-3xl" />
          <div className="absolute z-0 w-100 h-100 bg-gradient-to-b from-bg-gray-400/20 to-bg-transparent dark:bg-blue-600/20 rounded-full left-60 bottom-10 blur-3xl" />
        </div>
        <div className="z-10">
          <AppProviders>
            <AppLayout links={links}>{children}</AppLayout>
          </AppProviders>
        </div>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
