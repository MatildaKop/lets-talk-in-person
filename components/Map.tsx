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

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (typeof window.google !== 'undefined') {
          console.log('Google Maps API already loaded');
          resolve();
          return;
        }

        console.log('Loading Google Maps API script...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        window.initMap = () => {
          console.log('Google Maps API script loaded');
          resolve();
        };

        script.onerror = () => {
          console.error('Failed to load Google Maps script');
          reject(new Error('Failed to load Google Maps script'));
        };

        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      console.log('Initializing map...');
      if (!mapRef.current) {
        throw new Error('Map container not found');
      }

      const defaultLocation = { lat: 37.7749, lng: -122.4194 };
      const mapLocation = (currentUser && currentUser.location) || defaultLocation;

      const map = new window.google.maps.Map(mapRef.current, {
        center: mapLocation,
        zoom: 10,
      });

      console.log('Map created');

      if (currentUser?.location) {
        new window.google.maps.Marker({
          position: currentUser.location,
          map,
          title: currentUser.name || 'You',
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        console.log('Current user marker added');
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
      console.log('Active users markers added');
    };

    const initializeMap = async () => {
      console.log('Initializing map component...');
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key is not configured');
        setError('Google Maps API key is not configured');
        return;
      }

      try {
        await loadGoogleMapsScript();
        initMap();
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Error initializing map: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      }
    };

    if (isActive) {
      console.log('Map component is active, initializing...');
      initializeMap();
    } else {
      console.log('Map component is not active, skipping initialization');
    }

    return () => {
      console.log('Cleaning up map component...');
      const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (script) {
        document.head.removeChild(script);
        console.log('Removed Google Maps script');
      }
    };
  }, [currentUser, activeUsers, onStartConversation, isActive]);

  if (error) {
    return <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 text-red-500">{error}</div>;
  }

  return <div ref={mapRef} className="w-full h-[500px]" />;
};

export default MapComponent;
