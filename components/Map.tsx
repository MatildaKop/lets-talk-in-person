import React, { useEffect, useRef } from 'react';

const MapComponent = () => {
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
          new window.google.maps.Map(mapRef.current, {
            center: { lat: 37.7749, lng: -122.4194 },
            zoom: 10,
          });
        }
      };
    } else {
      window.initMap();
    }

    return () => {
      // Clean up
      delete window.initMap;
    };
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
