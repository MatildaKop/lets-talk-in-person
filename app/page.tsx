'use client'

import { useState, useCallback, useEffect } from 'react'
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
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const updatedUser = {
              ...user,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
            setCurrentUser(updatedUser)
            localStorage.setItem('currentUser', JSON.stringify(updatedUser))
          },
          (error) => {
            console.error("Error getting location:", error)
            setCurrentUser(user)
          }
        )
      } else {
        setCurrentUser(user)
      }
    }
  }, [])

  useEffect(() => {
    const mockUsers = generateMockUsers(5)
    setAllUsers(mockUsers)
  }, [])

  const handleLogin = useCallback((username: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newUser: User = {
            id: `user-${Date.now()}`,
            username,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          setCurrentUser(newUser)
          localStorage.setItem('currentUser', JSON.stringify(newUser))
          setAllUsers(prevUsers => [...prevUsers, newUser])
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enable location services and try again.")
        }
      )
    } else {
      alert("Geolocation is not supported by your browser. Please use a modern browser with location services enabled.")
    }
  }, [])

  const handleStartConversation = useCallback((userId: string) => {
    const user = allUsers.find(u => u.id === userId)
    if (user) {
      alert(`Starting conversation with ${user.username}`)
    }
  }, [allUsers])

  const handleToggleActive = useCallback((active: boolean) => {
    setIsActive(active)
  }, [])

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

  const activeUsers = isActive ? allUsers : (currentUser ? [currentUser] : [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header isActive={isActive} onToggleActive={handleToggleActive} />
      <main className="flex-1 mt-16 mb-16">
        <Map 
          currentUser={currentUser} 
          activeUsers={activeUsers}
          onStartConversation={handleStartConversation}
          isActive={isActive}
        />
      </main>
      <Navigation />
    </div>
  )
}
