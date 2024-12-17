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
            if
cat > app/profile/page.tsx << EOL
'use client'

import React, { useState } from 'react';
import { User } from '@/app/lib/types';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import MapComponent from '@/components/Map';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  isVisible: boolean;
  onToggle: () => void;
  onVisibilityToggle: () => void;
}

const Section: React.FC<SectionProps> = ({ title, children, isOpen, isVisible, onToggle, onVisibilityToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          <button onClick={onVisibilityToggle} className="p-1">
            {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button onClick={onToggle} className="p-1">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      {isOpen && isVisible && children}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'I love coding!',
    interests: ['React', 'TypeScript', 'Next.js'],
    location: { lat: 37.7749, lng: -122.4194 },
  });

  const [sections, setSections] = useState({
    personalInfo: { isOpen: true, isVisible: true },
    interests: { isOpen: true, isVisible: true },
    location: { isOpen: true, isVisible: true },
  
cat > app/layout.tsx << EOL
import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Let's Talk</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link href="/profile" className="hover:text-gray-300">Profile</Link></li>
                <li><Link href="/history" className="hover:text-gray-300">History</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto mt-4">
          <p className="text-gray-600 mb-4">{currentDate}</p>
          {children}
        </main>
      </body>
    </html>
  )
}
