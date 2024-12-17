'use client'

import React, { useEffect, useRef, useState } from 'react';
import { User } from '@/app/lib/types';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  currentUser: User | null;
  activeUsers: User[];
  onStartConversation: (userId: string) => void;
  isActive: boolean;
}

const MapComponent: React.FC<MapProps> = ({ currentUser, activeUsers, onStartConversation, isActive }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!isActive || !mapRef.current) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        
        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
          throw new Error('Google Maps API key is not configured');
        }

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: "weekly"
        });

        const google = await loader.load();
        
        const defaultLocation = { lat: 37.7749, lng: -122.4194 };
        const mapLocation = (currentUser && currentUser.location) || defaultLocation;

        const map = new google.maps.Map(mapRef.current, {
          center: mapLocation,
          zoom: 12,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        });

        setMapInstance(map);

        if (currentUser?.location) {
          new google.maps.Marker({
            position: currentUser.location,
            map,
            title: currentUser.name || 'You',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(32, 32)
            }
          });
        }

        activeUsers.forEach(user => {
          if (user.location) {
            const marker = new google.maps.Marker({
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
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstance) {
        // Clean up markers and map instance
        mapInstance.setMap(null);
        setMapInstance(null);
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

