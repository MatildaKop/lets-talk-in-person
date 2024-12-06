'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface LoginProps {
  onLogin: (username: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onLogin(username)
    }
  }, [username, onLogin])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  )
}
