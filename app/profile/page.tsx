'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import { Switch } from '@/components/ui/switch'
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'

export default function Profile() {
  const [isActive, setIsActive] = useState(true)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [visibleSections, setVisibleSections] = useState({
    personal: true,
    language: true,
    age: true,
    topics: true,
  })

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const toggleVisibility = (section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isActive={isActive} onToggleActive={setIsActive} />
      <main className="flex-1 mt-16 mb-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
        <p className="mb-4 text-sm text-gray-600">
          Customize Your Connection! Set your preferences to find the perfect match! Choose age range, preferred
          languages, and conversation topics to connect with people who share your interests and communication style.
        </p>

        <div className="space-y-4">
          <Section
            title="Personal Information"
            isOpen={openSection === 'personal'}
            isVisible={visibleSections.personal}
            onToggle={() => toggleSection('personal')}
            onVisibilityToggle={() => toggleVisibility('personal')}
          >
            <div className="space-y-2">
              <Field label="Full name" value="John Doe" />
              <Field label="Username" value="johndoe" />
              <Field label="Profession" value="Software Developer" />
              <Field label="Email" value="john.doe@example.com" />
              <Field label="Phone" value="+1 234 567 8900" />
              <Field label="Address" value="123 Main St, Anytown, USA" />
            </div>
          </Section>

          <Section
            title="Language Preferences"
            isOpen={openSection === 'language'}
            isVisible={visibleSections.language}
            onToggle={() => toggleSection('language')}
            onVisibilityToggle={() => toggleVisibility('language')}
          >
            <div className="grid grid-cols-3 gap-2">
              {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese'].map((lang) => (
                <div key={lang} className="flex items-center">
                  <input type="checkbox" id={lang} className="mr-2" />
                  <label htmlFor={lang}>{lang}</label>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Age Preferences"
            isOpen={openSection === 'age'}
            isVisible={visibleSections.age}
            onToggle={() => toggleSection('age')}
            onVisibilityToggle={() => toggleVisibility('age')}
          >
            <div className="grid grid-cols-3 gap-2">
              {['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((range) => (
                <div key={range} className="flex items-center">
                  <input type="checkbox" id={range} className="mr-2" />
                  <label htmlFor={range}>{range}</label>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Conversation Topics"
            isOpen={openSection === 'topics'}
            isVisible={visibleSections.topics}
            onToggle={() => toggleSection('topics')}
            onVisibilityToggle={() => toggleVisibility('topics')}
          >
            <div className="grid grid-cols-2 gap-2">
              {['Travel', 'Music', 'Movies', 'Books', 'Sports', 'Food', 'Technology', 'Art', 'Science', 'Politics'].map((topic) => (
                <div key={topic} className="flex items-center">
                  <input type="checkbox" id={topic} className="mr-2" />
                  <label htmlFor={topic}>{topic}</label>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </main>
      <Navigation />
    </div>
  )
}

function Section({ title, children, isOpen, isVisible, onToggle, onVisibilityToggle }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center">
          <button onClick={onVisibilityToggle} className="mr-2">
            {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button onClick={onToggle}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      {isOpen && children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span> {value}
    </div>
  )
}


