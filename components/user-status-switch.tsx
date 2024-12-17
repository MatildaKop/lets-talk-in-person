'use client'

import { useState } from 'react'
import { Switch } from "./ui/switch"

export function UserStatusSwitch() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isActive}
        onCheckedChange={setIsActive}
      />
      <span className="text-sm font-medium">
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  )
}
