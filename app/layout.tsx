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
