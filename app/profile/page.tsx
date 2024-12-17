'use client'

import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow p-4">
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
      {isOpen && children}
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
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: { ...prev[section], isOpen: !prev[section].isOpen },
    }));
  };

  const toggleVisibility = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: { ...prev[section], isVisible: !prev[section].isVisible },
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      <Section
        title="Personal Information"
        isOpen={sections.personalInfo.isOpen}
        isVisible={sections.personalInfo.isVisible}
        onToggle={() => toggleSection('personalInfo')}
        onVisibilityToggle={() => toggleVisibility('personalInfo')}
      >
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
        </div>
      </Section>

      <Section
        title="Interests"
        isOpen={sections.interests.isOpen}
        isVisible={sections.interests.isVisible}
        onToggle={() => toggleSection('interests')}
        onVisibilityToggle={() => toggleVisibility('interests')}
      >
        <ul>
          {user.interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </Section>

      <Section
        title="Location"
        isOpen={sections.location.isOpen}
        isVisible={sections.location.isVisible}
        onToggle={() => toggleSection('location')}
        onVisibilityToggle={() => toggleVisibility('location')}
      >
        <p>Latitude: {user.location.lat}</p>
        <p>Longitude: {user.location.lng}</p>
      </Section>
    </div>
  );
};

export default ProfilePage;

