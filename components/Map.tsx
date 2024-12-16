import React, { useEffect, useRef } from 'react';

interface User {
  id: string;
  name: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface MapProps {
  currentUser: User;
  activeUsers: User[];
  onStartConversation: (userId: string) => void;
  isActive: boolean;
}

const MapComponent = ({ currentUser, activeUsers, onStartConversation, isActive }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window.google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = () => {
        if (mapRef.current) {
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco coordinates
          const map = new window.google.maps.Map(mapRef.current, {
            center: currentUser.location || defaultLocation,
            zoom: 10,
          });

          // Add markers for active users
          activeUsers.forEach(user => {
            if (user.location) {
              const marker = new window.google.maps.Marker({
                position: user.location,
                map,
                title: user.name,
              });

              // Add click listener to marker
              marker.addListener('click', () => {
                onStartConversation(user.id);
              });
            }
          });
        }
      };
    } else {
      window.initMap();
    }

    return () => {
      delete window.initMap;
    };
  }, [currentUser, activeUsers, onStartConversation, isActive]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
