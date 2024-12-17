import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserStatusSwitch } from '@/components/user-status-switch'
import { BottomNavigation } from '@/components/bottom-navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Let's Talk in Person",
  description: 'Connect with people near you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex flex-col">
          <header className="border-b p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Let&apos;s Talk</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <UserStatusSwitch />
          </header>
          <main className="flex-grow pb-16">{children}</main>
          <BottomNavigation />
        </div>
      </body>
    </html>
  )
}
