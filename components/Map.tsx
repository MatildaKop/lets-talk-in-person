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

const logToServer = async (message: string) => {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.error('Failed to log to server:', error);
  }
};

const MapComponent: React.FC<MapProps> = ({ currentUser, activeUsers, onStartConversation, isActive }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logToServer(`Google Maps API Key: ${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Set' : 'Not set'}`);
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (typeof window.google !== 'undefined') {
          logToServer('Google Maps API already loaded');
          resolve();
          return;
        }

        logToServer('Loading Google Maps API script...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        window.initMap = () => {
          logToServer('Google Maps API script loaded');
          resolve();
        };

        script.onerror = () => {
          logToServer('Failed to load Google Maps script');
          reject(new Error('Failed to load Google Maps script'));
        };

        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      logToServer('Initializing map...');
      if (!mapRef.current) {
        throw new Error('Map container not found');
      }

      const defaultLocation = { lat: 37.7749, lng: -122.4194 };
      const mapLocation = (currentUser && currentUser.location) || defaultLocation;

      const map = new window.google.maps.Map(mapRef.current, {
        center: mapLocation,
        zoom: 10,
      });

      logToServer('Map created');

      if (currentUser?.location) {
        new window.google.maps.Marker({
          position: currentUser.location,
          map,
          title: currentUser.name || 'You',
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        logToServer('Current user marker added');
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
      logToServer('Active users markers added');
    };

    const initializeMap = async () => {
      logToServer('Initializing map component...');
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        logToServer('Google Maps API key is not configured');
        setError('Google Maps API key is not configured');
        return;
      }

      try {
        await loadGoogleMapsScript();
        initMap();
      } catch (err) {
        logToServer(`Error initializing map: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
        setError(`Error initializing map: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      }
    };

    if (isActive) {
      logToServer('Map component is active, initializing...');
      initializeMap();
    } else {
      logToServer('Map component is not active, skipping initialization');
    }

    return () => {
      logToServer('Cleaning up map component...');
      const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (script) {
        document.head.removeChild(script);
        logToServer('Removed Google Maps script');
      }
    };
  }, [currentUser, activeUsers, onStartConversation, isActive]);

  if (error) {
    return <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 text-red-500">{error}</div>;
  }

  return <div ref={mapRef} className="w-full h-[500px]" style={{ height: '500px' }} />;
};

export default MapComponent;
