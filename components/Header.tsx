'use client'

import { Switch } from "@/components/ui/switch"
import Image from 'next/image'

interface HeaderProps {
  isActive: boolean
  onToggleActive: (active: boolean) => void
}

export default function Header({ isActive, onToggleActive }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-10">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Image
            src="/app-icon.png"
            alt="Let'&apos;s talk!"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-semibold">Let'&apos;s talk!</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onCheckedChange={onToggleActive}
          />
          <span className="text-sm text-green-600">
            {isActive ? 'You are active!' : 'You are inactive'}
          </span>
        </div>
      </div>
    </header>
  )
}


