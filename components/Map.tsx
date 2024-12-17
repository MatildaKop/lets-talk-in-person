'use client'

import React, { useEffect, useRef, useState } from 'react';
import { User } from '@/app/lib/types';

interface MapProps {
  currentUser: User | null;
  activeUsers: User[];
  onStartConversation: (userId: string) => void;
  isActive: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC<MapProps> = ({ currentUser, activeUsers, onStartConversation, isActive }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isActive || !mapRef.current) return;

    const loadGoogleMaps = () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        setError('Google Maps API key is not configured');
        setIsLoading(false);
        return;
      }

      const loadTimeout = setTimeout(() => {
        setError('Map loading timed out. Please try again.');
        setIsLoading(false);
      }, 10000); // 10 seconds timeout

      window.initMap = () => {
        clearTimeout(loadTimeout);
        if (!mapRef.current) return;

        try {
          const defaultLocation = { lat: 37.7749, lng: -122.4194 };
          const mapLocation = (currentUser && currentUser.location) || defaultLocation;

          const map = new window.google.maps.Map(mapRef.current, {
            center: mapLocation,
            zoom: 12,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false
          });

          if (currentUser?.location) {
            new window.google.maps.Marker({
              position: currentUser.location,
              map,
              title: currentUser.name || 'You',
              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
          }

          activeUsers.forEach(user => {
            if (user.location) {
              const marker = new window.google.maps.Marker({
                position: user.location,
                map,
                title: user.name || 'Unknown User'
              });

              marker.addListener('click', () => onStartConversation(user.id));
            }
          });

          setIsLoading(false);
        } catch (err) {
          console.error('Error initializing map:', err);
          setError(err instanceof Error ? err.message : 'Failed to initialize map');
          setIsLoading(false);
        }
      };

      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY + '&callback=initMap';
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        clearTimeout(loadTimeout);
        setError('Failed to load Google Maps script');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMaps();
    } else {
      window.initMap();
    }

    return () => {
      if (window.google?.maps) {
        // @ts-ignore - Allow cleanup of google maps
        delete window.google.maps;
      }
      // @ts-ignore - Allow cleanup of initMap
      delete window.initMap;
      const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [currentUser, activeUsers, onStartConversation, isActive]);

  if (error) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-100 text-red-500 space-y-2">
        <p className="font-semibold">Error loading map</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[500px] rounded-lg shadow-lg"
      aria-label="Google Map"
    />
  );
};

export default MapComponent;

