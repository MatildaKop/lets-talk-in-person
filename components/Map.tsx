import React, { useEffect, useRef, useState } from 'react';
import { User } from '../lib/types';

interface MapProps {
  currentUser: User | null;
  activeUsers: User[];
  onStartConversation: (userId: string) => void;
  isActive: boolean;
}

const MapComponent = ({ currentUser, activeUsers, onStartConversation, isActive }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onerror = () => {
        console.error('Google Maps script failed to load');
        setError('Failed to load Google Maps');
      };

      window.initMap = initMap;
    };

    const initMap = () => {
      console.log('Initializing map with:', { currentUser, activeUsers, isActive });
      if (!mapRef.current) return;

      try {
        const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
        const mapLocation = (currentUser && currentUser.location) || defaultLocation;

        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not loaded');
        }

        console.log('Creating map with:', { mapLocation, mapRef: mapRef.current });
        const map = new window.google.maps.Map(mapRef.current, {
          center: mapLocation,
          zoom: 10,
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
              title: user.name || 'Unknown User',
            });

            marker.addListener('click', () => onStartConversation(user.id));
          }
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Error initializing map: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      }
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }

    return () => {
      delete window.initMap;
    };
  }, [currentUser, activeUsers, onStartConversation, isActive]);

  if (error) {
    return <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 text-red-500">{error}</div>;
  }

  return <div ref={mapRef} className="w-full h-[500px]" />;
};

export default MapComponent;
