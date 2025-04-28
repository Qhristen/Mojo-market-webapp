import { AppLayout } from '@/components/app-layout'
import { AppProviders } from '@/components/app-providers'
import type { Metadata } from 'next'
import React from 'react'
import './globals.css'


export const metadata: Metadata = {
  title: 'Mojo market',
  description: 'Web3',
}

const links: { label: string; path: string }[] = [
  // More links...
  { label: 'Market', path: '/' },
  { label: 'Swap', path: '/swap' },
  { label: 'Stats', path: '/stats' },
  { label: 'Portfolio', path: '/portfolio' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
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
