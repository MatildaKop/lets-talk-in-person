'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Clock } from 'lucide-react'
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/history", icon: Clock, label: "History" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="container flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              "transition-colors hover:text-primary",
              pathname === href ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

