'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { User } from '@/lib/mockData'

interface MapProps {
  currentUser: User
  activeUsers: User[]
  onStartConversation: (userId: string) => void
}

export default function Map({ currentUser, activeUsers, onStartConversation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  const addDebugInfo = useCallback((info: string) => {
    setDebugInfo(prev => `${prev}\n${info}`)
    console.log(info)
  }, [])

  const initMap = useCallback(() => {
    addDebugInfo('Initializing map...')
    try {
      if (!mapRef.current) throw new Error('Map container not found')

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: currentUser.latitude, lng: currentUser.longitude },
        zoom: 15,
      })

      addDebugInfo('Map instance created')

      const newMarkers = activeUsers.map(user => {
        const marker = new google.maps.Marker({
          position: { lat: user.latitude, lng: user.longitude },
          map,
          title: user.username,
        })

        if (user.id !== currentUser.id) {
          marker.addListener('click', () => {
            onStartConversation(user.id)
          })
        }

        return marker
      })

      setMarkers(newMarkers)
      addDebugInfo('Markers added successfully')
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      addDebugInfo(`Error initializing map: ${errorMessage}`)
      setError(`Failed to initialize map: ${errorMessage}`)
      setIsLoading(false)
    }
  }, [currentUser, activeUsers, onStartConversation, addDebugInfo])

  useEffect(() => {
    if (typeof window === 'undefined'
 if (user.id !== currentUser.id) {
          marker.addListener('click', () => {
            onStartConversation(user.id)
          })
        }

        return marker
      })

      setMarkers(newMarkers)
      addDebugInfo('Markers added successfully')
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      addDebugInfo(`Error initializing map: ${errorMessage}`)
      setError(`Failed to initialize map: ${errorMessage}`)
      setIsLoading(false)
    }
  }, [currentUser, activeUsers, onStartConversation, addDebugInfo])

  useEffect(() => {
    if (typeof window === 'undefined'
heredoc> 
cat << EOF > components/Map.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { User } from '@/lib/mockData'

interface MapProps {
  currentUser: User
  activeUsers: User[]
  onStartConversation: (userId: string) => void
}

export default function Map({ currentUser, activeUsers, onStartConversation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  const addDebugInfo = useCallback((info: string) => {
    setDebugInfo(prev => `${prev}\n${info}`)
    console.log(info)
  }, [])

  const initMap = useCallback(() => {
    addDebugInfo('Initializing map...')
    try {
      if (!mapRef.current) throw new Error('Map container not found')

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: currentUser.latitude, lng: currentUser.longitude },
        zoom: 15,
      })

      addDebugInfo('Map instance created')

      const newMarkers = activeUsers.map(user => {
        const marker = new google.maps.Marker({
          position: { lat: user.latitude, lng: user.longitude },
          map,
          title: user.username,
        })

        if (user.id !== currentUser.id) {
          marker.addListener('click', () => {
            onStartConversation(user.id)
          })
        }

        return marker
      })

      setMarkers(newMarkers)
      addDebugInfo('Markers added successfully')
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      addDebugInfo(`Error initializing map: ${errorMessage}`)
      setError(`Failed to initialize map: ${errorMessage}`)
      setIsLoading(false)
    }
  }, [currentUser, activeUsers, onStartConversation, addDebugInfo])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) {
      setDebugInfo('Window or mapRef not available')
      return
    }

    if (!window.google) {
      addDebugInfo('Loading Google Maps script...')
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      script.async = true
      script.defer = true
      script.onerror = () => {
        addDebugInfo('Failed to load Google Maps script')
        setError('Failed to load Google Maps')
        setIsLoading(false)
      }
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      addDebugInfo('Google Maps already loaded')
      initMap()
    }

    return () => {
      addDebugInfo('Cleaning up map component')
      markers.forEach(marker => marker.setMap(null))
    }
  }, [initMap, addDebugInfo, markers])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 rounded-lg p-4">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-600 mb-4">Please check your Google Maps API configuration</p>
          <details className="text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Debug Information</summary>
            <pre className="mt-2 p-2 bg-gray-200 rounded text-xs whitespace-pre-wrap">
              {debugInfo || 'No debug information available'}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 rounded-lg p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading map...</p>
          <details className="text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Debug Information</summary>
            <pre className="mt-2 p-2 bg-gray-200 rounded text-xs whitespace-pre-wrap">
              {debugInfo || 'No debug information available'}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />
}
