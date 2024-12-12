'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { User } from '@/lib/mockData'
import { AlertCircle } from 'lucide-react'

interface MapProps {
  currentUser: User
  activeUsers: User[]
  onStartConversation: (userId: string) => void
  isActive: boolean
}

export default function Map({ currentUser, activeUsers, onStartConversation, isActive }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
  }, [])

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: currentUser.latitude, lng: currentUser.longitude },
      zoom: 15,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    setMapInstance(map)

    clearMarkers()

    const usersToShow = isActive ? activeUsers : activeUsers.filter(user => user.id !== currentUser.id);
    usersToShow.forEach(user => {
      const marker = new google.maps.Marker({
        position: { lat: user.latitude, lng: user.longitude },
        map,
        title: user.username,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: user.id === currentUser.id ? '#4a90e2' : '#c30b82',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        }
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${user.username}</strong></div>`
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        if (user.id !== currentUser.id) {
          onStartConversation(user.id)
        }
      })

      markersRef.current.push(marker)
    })
  }, [currentUser, activeUsers, onStartConversation, clearMarkers, isActive])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key is not configured')
      return
    }

    let isLoading = false
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap()
        return
      }

      if (isLoading) return

      isLoading = true
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      script.async = true
      script.defer = true
      script.onload = () => {
        isLoading = false
        initMap()
      }
      script.onerror = () => {
        isLoading = false
        setError('Failed to load Google Maps script')
      }
      document.head.appendChild(script)
    }

    loadGoogleMapsScript()

    return () => {
      clearMarkers()
      if (mapInstance) {
        const mapElement = mapRef.current
        if (mapElement && mapElement.firstChild) {
          mapElement.removeChild(mapElement.firstChild)
        }
        setMapInstance(null)
      }
    }
  }, [initMap, clearMarkers])

  useEffect(() => {
    if (mapInstance && currentUser) {
      clearMarkers()
      const usersToShow = [...activeUsers]
      if (!usersToShow.some(user => user.id === currentUser.id)) {
        usersToShow.push(currentUser)
      }
      usersToShow.forEach(user => {
        const marker = new google.maps.Marker({
          position: { lat: user.latitude, lng: user.longitude },
          map: mapInstance,
          title: user.username,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: user.id === currentUser.id ? '#4a90e2' : '#c30b82',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${user.username}</strong></div>`
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker)
          if (user.id !== currentUser.id) {
            onStartConversation(user.id)
          }
        })

        markersRef.current.push(marker)
      })
    }
  }, [mapInstance, activeUsers, currentUser, onStartConversation, clearMarkers, isActive])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] bg-gray-100 rounded-lg p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium mb-2">{error}</p>
          <p className="text-sm text-gray-600">
            Please check your Google Maps API configuration in the environment variables.
          </p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-[calc(100vh-8rem)] rounded-lg shadow-md" />
}
