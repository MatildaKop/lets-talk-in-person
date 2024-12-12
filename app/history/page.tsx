'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import { Clock, Users } from 'lucide-react'

export default function History() {
  const [isActive, setIsActive] = useState(true)

  const conversations = [
    { id: 1, name: 'Alice', duration: '30 mins', date: '12/11/2024', time: '12:00 - 12:30' },
    { id: 2, name: 'Bob', duration: '22 mins', date: '11/11/2024', time: '11:00 - 11:22' },
    { id: 3, name: 'Charlie', duration: '15 mins', date: '10/11/2024', time: '13:00 - 13:15' },
    { id: 4, name: 'David', duration: '1 hour', date: '09/11/2024', time: '12:00 - 13:00' },
    { id: 5, name: 'Eve', duration: '55 mins', date: '07/11/2024', time: '10:05 - 11:00' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isActive={isActive} onToggleActive={setIsActive} />
      <main className="flex-1 mt-16 mb-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Conversation History</h1>
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div key={conv.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">You had a conversation with {conv.name}</h2>
              </div>
              <div className="flex items-center text-gray-600 mb-1">
                <Users size={16} className="mr-2" />
                <span>{conv.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{conv.time}, {conv.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Navigation />
    </div>
  )
}


