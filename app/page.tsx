'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Login from '@/components/Login'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import { User, generateMockUsers } from '@/lib/mockData'

const Map = dynamic(() => import('@/components/Map'), { 
  loading: () => <p>Loading map...</p>,
  ssr: false 
})

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const mockUsers = generateMockUsers(10)
    setActiveUsers(mockUsers)
  }, [])

  const handleLogin = useCallback((username: string) => {
    const newUser: User = {
      id: `user-${activeUsers.length + 1}`,
      username,
      latitude: 41.1231,
      longitude: 20.8016,
    }
    setCurrentUser(newUser)
    setActiveUsers(prevUsers => [...prevUsers, newUser])
  }, [activeUsers.length])

  const handleStartConversation = useCallback((userId: string) => {
    const user = activeUsers.find(u => u.id === userId)
    if (user) {
      alert(`Starting conversation with ${user.username}`)
    }
  }, [activeUsers])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center">Let&apos;s Talk in Person</h1>
          <Login onLogin={handleLogin} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isActive={isActive} onToggleActive={setIsActive} />
      <main className="flex-1 mt-16 mb-16">
        <Map 
          currentUser={currentUser} 
          activeUsers={activeUsers.filter(user => user.id === currentUser.id || isActive)}
          onStartConversation={handleStartConversation}
        />
      </main>
      <Navigation />
    </div>
  )
}
