import React from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

console.log("API Key:", GOOGLE_MAPS_API_KEY);

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps API key is not configured in environment variables');
}

const MapComponent = () => {
  const center = { lat: 37.7749, lng: -122.4194 };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '500px', height: '500px' }}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
