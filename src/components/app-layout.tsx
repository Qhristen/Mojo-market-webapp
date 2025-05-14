'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { AppHeader } from '@/components/app-header'
import React from 'react'
import { AppFooter } from '@/components/app-footer'
import { ClusterChecker } from '@/components/cluster/cluster-ui'
import { AccountChecker, MojoBalanceCheck, MojoChecker } from '@/components/account/account-ui'

export function AppLayout({
  children,
  links,
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen  p-4 lg:p-0">
        <AppHeader links={links} />
        <main className="flex-grow container max-w-6xl mx-auto">
          <ClusterChecker>
            <AccountChecker />
            <MojoChecker />
          </ClusterChecker>
          {children}
        </main>
        {/* <AppFooter /> */}
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
