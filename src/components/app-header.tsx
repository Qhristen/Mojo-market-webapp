'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterButton, WalletButton } from '@/components/solana/solana-provider'
import Image from 'next/image'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="relative z-50 py-2 bg-transparent">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6 rounded-md bg-card text-card-foreground">
        <div className="flex items-baseline gap-4">
          <Link className="text-xl hover:text-neutral-500 dark:hover:text-white" href="/">
            {/* <span className='font-PPMori'>Mojo market</span> */}
            <Image width={150} height={50} className='dark:brightness-200' src="/assets/images/mojo_logo.png" alt="mojo_logo" />
          </Link>
        </div>
        <div className="hidden md:flex items-center">
          <ul className="flex gap-4 flex-nowrap items-center">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  // className={`px-4 py-2 rounded-md border border-border bg-card hover:bg-accent/5 transition-colors ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''}`}
                  // className={`hover:text-neutral-500 dark:hover:text-white ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''}`}
                  href={path}
                >
                  <Button variant={"outline"} size={"sm"} className={`${isActive(path) ? 'text-neutral-500' : ''}`} >

                  {label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:flex items-center gap-4">
          <WalletButton size="sm" />
          <ClusterButton size="sm" />
          <ThemeSelect />
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`hover:text-neutral-500 dark:hover:text-white block text-lg py-2  ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''} `}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <WalletButton />
                <ClusterButton />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
