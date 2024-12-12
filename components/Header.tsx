'use client'

import { Switch } from "@/components/ui/switch"
import { MessageCircle } from 'lucide-react'

interface HeaderProps {
  isActive: boolean
  onToggleActive: (active: boolean) => void
}

export default function Header({ isActive, onToggleActive }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-10">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold">Let&apos;s talk!</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onCheckedChange={onToggleActive}
            className={isActive ? '' : 'bg-red-500'}
          />
          <span className={`text-sm ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            {isActive ? 'You are active!' : 'You are inactive'}
          </span>
        </div>
      </div>
    </header>
  )
}
