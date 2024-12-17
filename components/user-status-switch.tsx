'use client'

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function UserStatusSwitch() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="user-status"
        checked={isActive}
        onCheckedChange={setIsActive}
      />
      <Label htmlFor="user-status" className="text-sm font-medium">
        {isActive ? 'Active' : 'Inactive'}
      </Label>
    </div>
  )
}
