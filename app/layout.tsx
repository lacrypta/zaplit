import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppInitializer } from '@/components/AppInitializer';
import { TeamProvider } from '../contexts/team-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ZapSplit',
  description: 'Split bills using zaps',
  generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TeamProvider>
          <AppInitializer />
          {children}
        </TeamProvider>
      </body>
    </html>
  );
}
