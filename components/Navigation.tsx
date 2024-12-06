'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, History } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <NavLink href="/" icon={<Home className="h-6 w-6" />} label="Home" isActive={pathname === '/'} />
        <NavLink href="/profile" icon={<User className="h-6 w-6" />} label="Profile" isActive={pathname === '/profile'} />
        <NavLink href="/history" icon={<History className="h-6 w-6" />} label="History" isActive={pathname === '/history'} />
      </div>
    </nav>
  )
}

function NavLink({ href, icon, label, isActive }) {
  return (
    <Link href={href} className={`flex flex-col items-center ${isActive ? 'text-blue-500' : 'text-gray-600'}`}>
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  )
}


